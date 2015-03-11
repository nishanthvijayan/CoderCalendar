# -*- coding: utf-8 -*-

import os
from flask import Flask, jsonify
from bs4 import BeautifulSoup
from operator import itemgetter
from time import strptime,strftime,mktime,gmtime,localtime
import json
from urllib2 import urlopen
import threading

app = Flask(__name__)


#add duration ?

posts= {"ongoing":[] , "upcoming":[]}

def getDataFromCodechef():
    page = urlopen("http://www.codechef.com/contests")
    soup = BeautifulSoup(page,"html.parser")

    statusdiv = soup.findAll("div",attrs = {"id":"statusdiv"})
    ongoing_contests = statusdiv[0].findAll("tr")
    for ongoing_contest in ongoing_contests[1:]:
        details = ongoing_contest.findAll("td")
        end_time = strptime(details[3].string, "%Y-%m-%d %H:%M:%S")
        posts["ongoing"].append({ "Name" :  details[1].string  , "url" : "http://www.codechef.com"+details[1].a["href"] , "EndTime" : strftime("%a, %d %b %Y %H:%M", end_time) ,"Platform":"CODECHEF"})
    
    upcoming_contests = statusdiv[1].findAll("tr")
    for upcoming_contest in upcoming_contests[1:]:
        details = upcoming_contest.findAll("td")
        start_time = strptime(details[2].string, "%Y-%m-%d %H:%M:%S")
        end_time = strptime(details[3].string, "%Y-%m-%d %H:%M:%S")
        duration = str(abs(mktime(start_time)-mktime(end_time))/(60.0*60.0))
        posts["upcoming"].append({"Name" :  details[1].string  , "url" : "http://www.codechef.com"+details[1].a["href"] , "StartTime" : strftime("%a, %d %b %Y %H:%M", start_time) ,"Platform":"CODECHEF" })


def getDataFromHackerearth():
    page = urlopen("https://www.hackerearth.com/chrome-extension/events/")
    data = json.load(page)
    for item in data:
        start_time = strptime(item["start_tz"].strip()[:19], "%Y-%m-%d %H:%M:%S")
        end_time = strptime(item["end_tz"].strip()[:19], "%Y-%m-%d %H:%M:%S")
        duration = str(abs(mktime(start_time)-mktime(end_time))/(60.0*60.0))
        if item["status"].strip()=="UPCOMING":  
            posts["upcoming"].append({ "Name" :  item["title"].strip()  , "url" : item["url"].strip() , "StartTime" : strftime("%a, %d %b %Y %H:%M", start_time),"Platform":"HACKEREARTH"  })
        else:
            posts["ongoing"].append({  "Name" :  item["title"].strip()  , "url" : item["url"].strip() , "EndTime"   : strftime("%a, %d %b %Y %H:%M", end_time)  ,"Platform":"HACKEREARTH"  })

def getDataFromCodeforces():
    page = urlopen("http://codeforces.com/api/contest.list")
    data = json.load(page)["result"]
    for item in data:
        
        if item["phase"]=="FINISHED": break
        
        start_time = strftime("%a, %d %b %Y %H:%M",gmtime(item["startTimeSeconds"]+19800))
        end_time   = strftime("%a, %d %b %Y %H:%M",gmtime(item["durationSeconds"]+item["startTimeSeconds"]+19800))
        
        if item["phase"].strip()=="BEFORE":  
            posts["upcoming"].append({ "Name" :  item["name"] , "url" : "http://codeforces.com/contest/"+str(item["id"]) , "StartTime" :  start_time,"Platform":"CODEFORCES"  })
        else:
            posts["ongoing"].append({  "Name" :  item["name"] , "url" : "http://codeforces.com/contest/"+str(item["id"])  , "EndTime"   : end_time  ,"Platform":"CODEFORCES"  })

def getDataFromTopcoder():
    page = urlopen("http://api.topcoder.com/v2/data/srm/schedule?pageSize=5")
    data = json.load(page)["data"]

    for item in data:
        if item["name"]=="Round 1":
                        
            start_time = strptime(item["codingStartTime"][:19], "%Y-%m-%dT%H:%M:%S")
            start_time_indian = strftime("%a, %d %b %Y %H:%M",gmtime(mktime(start_time)+54000))
            
            
            end_time = strptime(item["challengeEndTime"][:19], "%Y-%m-%dT%H:%M:%S")
            end_time_indian = strftime("%a, %d %b %Y %H:%M",gmtime(mktime(end_time)+54000))
            
            cur_time = localtime()
            if cur_time>start_time_indian and cur_time<end_time_indian:
                posts["upcoming"].append({ "Name" :  item["contestName"] , "url" : "http://community.topcoder.com/tc?module=MatchDetails&rd="+str(item["roundId"]) , "EndTime" :  end_time_indian,"Platform":"TOPCODER"  })
            elif cur_time>start_time_indian:
                posts["upcoming"].append({ "Name" :  item["contestName"] , "url" : "http://community.topcoder.com/tc?module=MatchDetails&rd="+str(item["roundId"]) , "StartTime" :  start_time_indian,"Platform":"TOPCODER"  })

def fetch():

    thread_list = []
    
    thread_list.append( threading.Thread(target=getDataFromCodeforces) )
    thread_list.append( threading.Thread(target=getDataFromTopcoder) )
    thread_list.append( threading.Thread(target=getDataFromHackerearth) )
    thread_list.append( threading.Thread(target=getDataFromCodechef) )

    for thread in thread_list:
        thread.start()

    for thread in thread_list:
        thread.join()


@app.route('/')
@app.route('/data.json')
def index():
    
    posts["upcoming"]=[]
    posts["ongoing"]=[]

    fetch()
    
    posts["upcoming"] = sorted(posts["upcoming"], key=lambda k: strptime(k['StartTime'], "%a, %d %b %Y %H:%M"))
    posts["ongoing"] = sorted(posts["ongoing"], key=lambda k: strptime(k['EndTime'], "%a, %d %b %Y %H:%M"))
    
    resp = jsonify(result=posts)
    resp.status_code = 200
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


if __name__ == '__main__':
    #app.run(debug=True)
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port,debug=True)