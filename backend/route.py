# -*- coding: utf-8 -*-

import os
from flask import Flask, jsonify
from bs4 import BeautifulSoup
from operator import itemgetter
from time import strptime,strftime,mktime,gmtime,localtime
import json
from urllib2 import urlopen
import threading
# import the flask extension
from flask.ext.cache import Cache   

app = Flask(__name__)

# define the cache config keys, remember that it can be done in a settings file
app.config['CACHE_TYPE'] = 'simple'

# register the cache instance and binds it on to your app 
app.cache = Cache(app)   




posts= {"ongoing":[] , "upcoming":[]}
hackerrank_contests = {"urls":[]}

def get_duration(duration):
    days = duration/(60*24)
    duration %= 60*24
    hours = duration/60
    duration %= 60
    minutes = duration
    ans=""
    if days==1: ans+=str(days)+" day "
    elif days!=0: ans+=str(days)+" days "
    if hours!=0:ans+=str(hours)+"h "
    if minutes!=0:ans+=str(minutes)+"m"
    return ans.strip()

def fetch_codechef():
    page = urlopen("http://www.codechef.com/contests")
    soup = BeautifulSoup(page,"html.parser")

    statusdiv = soup.findAll("div",attrs = {"class":"table-questions"})
    upcoming_contests = statusdiv[1].findAll("tr")
    if(len(upcoming_contests) <100):
        for upcoming_contest in upcoming_contests[1:]:
            details = upcoming_contest.findAll("td")
            start_time = strptime(details[2].string, "%Y-%m-%d %H:%M:%S")
            end_time = strptime(details[3].string, "%Y-%m-%d %H:%M:%S")
            duration = get_duration(int(( mktime(end_time)-mktime(start_time) )/60 ))
            posts["upcoming"].append({"Name" :  details[1].string  , "url" : "http://www.codechef.com"+details[1].a["href"] , "StartTime" : strftime("%a, %d %b %Y %H:%M", start_time),"EndTime" : strftime("%a, %d %b %Y %H:%M", end_time),"Duration":duration ,"Platform":"CODECHEF" })

        ongoing_contests = statusdiv[0].findAll("tr")
        for ongoing_contest in ongoing_contests[1:]:
            details = ongoing_contest.findAll("td")
            end_time = strptime(details[3].string, "%Y-%m-%d %H:%M:%S")
            posts["ongoing"].append({ "Name" :  details[1].string  , "url" : "http://www.codechef.com"+details[1].a["href"] , "EndTime" : strftime("%a, %d %b %Y %H:%M", end_time) ,"Platform":"CODECHEF"})
    else:
        upcoming_contests = statusdiv[0].findAll("tr")
        for upcoming_contest in upcoming_contests[1:]:
            details = upcoming_contest.findAll("td")
            start_time = strptime(details[2].string, "%Y-%m-%d %H:%M:%S")
            end_time = strptime(details[3].string, "%Y-%m-%d %H:%M:%S")
            duration = get_duration(int(( mktime(end_time)-mktime(start_time) )/60 ))
            posts["upcoming"].append({"Name" :  details[1].string  , "url" : "http://www.codechef.com"+details[1].a["href"] , "StartTime" : strftime("%a, %d %b %Y %H:%M", start_time),"EndTime" : strftime("%a, %d %b %Y %H:%M", end_time),"Duration":duration ,"Platform":"CODECHEF" })
    

def fetch_hackerearth():
    cur_time = localtime()
    ref_date =  strftime("%Y-%m-%d",  localtime(mktime(localtime())   - 432000))
    duplicate_check=[]

    page = urlopen("https://www.hackerearth.com/chrome-extension/events/")
    data = json.load(page)["response"]
    for item in data:
        start_time = strptime(item["start_tz"].strip()[:19], "%Y-%m-%d %H:%M:%S")
        end_time = strptime(item["end_tz"].strip()[:19], "%Y-%m-%d %H:%M:%S")
        duration = get_duration(int(( mktime(end_time)-mktime(start_time) )/60 ))
        duplicate_check.append(item["title"].strip())
        
        if item["challenge_type"]=='hiring':challenge_type = 'hiring'
        else: challenge_type = 'contest'

        if item["status"].strip()=="UPCOMING":
            posts["upcoming"].append({ "Name" :  item["title"].strip()  , "url" : item["url"].strip() , "StartTime" : strftime("%a, %d %b %Y %H:%M", start_time),"EndTime" : strftime("%a, %d %b %Y %H:%M", end_time),"Duration":duration,"Platform":"HACKEREARTH","challenge_type": challenge_type  })
        elif item["status"].strip()=="ONGOING":
            posts["ongoing"].append({ "Name" :  item["title"].strip()  , "url" : item["url"].strip() , "EndTime" : strftime("%a, %d %b %Y %H:%M", end_time),"Platform":"HACKEREARTH","challenge_type": challenge_type  })
    

def fetch_codeforces():
    page = urlopen("http://codeforces.com/api/contest.list")
    data = json.load(page)["result"]
    for item in data:
        
        if item["phase"]=="FINISHED": break
        
        start_time = strftime("%a, %d %b %Y %H:%M",gmtime(item["startTimeSeconds"]+19800))
        end_time   = strftime("%a, %d %b %Y %H:%M",gmtime(item["durationSeconds"]+item["startTimeSeconds"]+19800))
        duration = get_duration( item["durationSeconds"]/60 )
        
        if item["phase"].strip()=="BEFORE":  
            posts["upcoming"].append({ "Name" :  item["name"] , "url" : "http://codeforces.com/contest/"+str(item["id"]) , "StartTime" :  start_time,"EndTime" : end_time,"Duration":duration,"Platform":"CODEFORCES"  })
        else:
            posts["ongoing"].append({  "Name" :  item["name"] , "url" : "http://codeforces.com/contest/"+str(item["id"])  , "EndTime"   : end_time  ,"Platform":"CODEFORCES"  })

def fetch_topcoder():
    try:
        page = urlopen("https://clients6.google.com/calendar/v3/calendars/appirio.com_bhga3musitat85mhdrng9035jg@group.calendar.google.com/events?calendarId=appirio.com_bhga3musitat85mhdrng9035jg%40group.calendar.google.com&singleEvents=true&timeZone=Asia%2FCalcutta&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=2015-04-26T00%3A00%3A00-04%3A00&timeMax=2016-06-07T00%3A00%3A00-04%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs",timeout=15)
        data = json.load(page)["items"]
        cur_time = localtime()
        for item in data:
		if(item["start"].has_key("date")):continue
		        
                start_time = strptime(item["start"]["dateTime"][:19], "%Y-%m-%dT%H:%M:%S")
                start_time_indian = strftime("%a, %d %b %Y %H:%M",start_time)
                end_time = strptime(item["end"]["dateTime"][:19], "%Y-%m-%dT%H:%M:%S")
                end_time_indian = strftime("%a, %d %b %Y %H:%M",end_time)

                duration = get_duration(int(( mktime(end_time)-mktime(start_time) )/60 ))
                name = item["summary"]
                if "SRM" in name: url = "http://community.topcoder.com/tc?module=MatchDetails&rd="+ item["description"][110:115]
                else :            url = "http://tco15.topcoder.com/algorithm/rules/"
                
                if cur_time<start_time:
                    posts["upcoming"].append({ "Name" :  name , "url" : url ,"EndTime" : end_time_indian,"Duration":duration, "StartTime" :  start_time_indian,"Platform":"TOPCODER"  })
                elif cur_time>start_time and cur_time<end_time:
                    posts["ongoing"].append({ "Name" :  name , "url" : url ,"EndTime" : end_time_indian,"Platform":"TOPCODER"  })
                    
    except Exception, e:
        pass
    
def fetch_hackerrank_general():
    cur_time = str(int(mktime(localtime())*1000))
    page = urlopen("https://www.hackerrank.com/rest/contests/upcoming?offset=0&limit=10&contest_slug=active&_="+cur_time)
    data = json.load(page)["models"]
    for item in data:
        if not item["ended"] and ("https://www.hackerrank.com/"+item["slug"]) not in hackerrank_contests["urls"]:
            start_time = strptime(item["get_starttimeiso"], "%Y-%m-%dT%H:%M:%SZ")
            end_time = strptime(item["get_endtimeiso"], "%Y-%m-%dT%H:%M:%SZ")
            duration = get_duration(int(( mktime(end_time)-mktime(start_time) )/60 ))
            if not item["started"]:
                hackerrank_contests["urls"].append("https://www.hackerrank.com/"+item["slug"])
                posts["upcoming"].append({ "Name" :  item["name"] , "url" : "https://www.hackerrank.com/"+item["slug"] , "StartTime" :  strftime("%a, %d %b %Y %H:%M", localtime(mktime(start_time)+19800)),"EndTime" : strftime("%a, %d %b %Y %H:%M", localtime(mktime(end_time)+19800)),"Duration":duration,"Platform":"HACKERRANK"  })
            elif   item["started"]:
                hackerrank_contests["urls"].append("https://www.hackerrank.com/"+item["slug"])
                posts["ongoing"].append({  "Name" :  item["name"] , "url" : "https://www.hackerrank.com/"+item["slug"]  , "EndTime"   : strftime("%a, %d %b %Y %H:%M", localtime(mktime(end_time)+19800))  ,"Platform":"HACKERRANK"  })

def fetch_hackerrank_college():
    cur_time = str(int(mktime(localtime())*1000))
    page = urlopen("https://www.hackerrank.com/rest/contests/college?offset=0&limit=50&_="+cur_time)
    data = json.load(page)["models"]
    for item in data:
        if not item["ended"] and ("https://www.hackerrank.com/"+item["slug"]) not in hackerrank_contests["urls"]:
            start_time = strptime(item["get_starttimeiso"], "%Y-%m-%dT%H:%M:%SZ")
            end_time = strptime(item["get_endtimeiso"], "%Y-%m-%dT%H:%M:%SZ")
            duration = get_duration(int(( mktime(end_time)-mktime(start_time) )/60 ))
            if not item["started"]:
                hackerrank_contests["urls"].append("https://www.hackerrank.com/"+item["slug"])
                posts["upcoming"].append({ "Name" :  item["name"] , "url" : "https://www.hackerrank.com/"+item["slug"] , "StartTime" :  strftime("%a, %d %b %Y %H:%M", localtime(mktime(start_time)+19800)),"EndTime" : strftime("%a, %d %b %Y %H:%M", localtime(mktime(end_time)+19800)),"Duration":duration,"Platform":"HACKERRANK"  })
            elif   item["started"]:
                hackerrank_contests["urls"].append("https://www.hackerrank.com/"+item["slug"])
                posts["ongoing"].append({  "Name" :  item["name"] , "url" : "https://www.hackerrank.com/"+item["slug"]  , "EndTime"   : strftime("%a, %d %b %Y %H:%M", localtime(mktime(end_time)+19800))  ,"Platform":"HACKERRANK"  })

def fetch_google():
	cur_time = localtime()
	page = urlopen("https://clients6.google.com/calendar/v3/calendars/google.com_jqv7qt9iifsaj94cuknckrabd8@group.calendar.google.com/events?calendarId=google.com_jqv7qt9iifsaj94cuknckrabd8%40group.calendar.google.com&singleEvents=true&timeZone=Asia%2FCalcutta&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=2015-04-26T00%3A00%3A00-07%3A00&timeMax=2016-06-07T00%3A00%3A00-07%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs")
	data = json.load(page)["items"]
	for item in data:
		if item["start"].has_key("dateTime"):
		    start_time = strptime(item["start"]["dateTime"][:19], "%Y-%m-%dT%H:%M:%S")
		    end_time = strptime(item["end"]["dateTime"][:19], "%Y-%m-%dT%H:%M:%S")
		    duration = get_duration(int(( mktime(end_time)-mktime(start_time) )/60 ))

		    if cur_time>start_time and cur_time<end_time:
		        posts["ongoing"].append({  "Name" :  "Google Code Jam "+item["summary"]  , "url" : "https://code.google.com/codejam" , "EndTime"   : strftime("%a, %d %b %Y %H:%M", end_time)  ,"Platform":"GOOGLE"  })
		    elif cur_time<start_time:
		        posts["upcoming"].append({ "Name" :  "Google Code Jam "+item["summary"]  , "url" : "https://code.google.com/codejam" , "StartTime" : strftime("%a, %d %b %Y %H:%M", start_time),"EndTime" : strftime("%a, %d %b %Y %H:%M", end_time),"Duration":duration,"Platform":"GOOGLE" })

def fetch():


    posts["upcoming"]=[]
    posts["ongoing"]=[]
    hackerrank_contests["urls"] = []
    thread_list = []
    
    thread_list.append( threading.Thread(target=fetch_codeforces) )
    thread_list.append( threading.Thread(target=fetch_topcoder) )
    thread_list.append( threading.Thread(target=fetch_hackerearth) )
    thread_list.append( threading.Thread(target=fetch_codechef) )
    thread_list.append( threading.Thread(target=fetch_hackerrank_general) )
    thread_list.append( threading.Thread(target=fetch_hackerrank_college) )
    thread_list.append( threading.Thread(target=fetch_google) )

    for thread in thread_list:
        thread.start()

    for thread in thread_list:
        thread.join()

    posts["upcoming"] = sorted(posts["upcoming"], key=lambda k: strptime(k['StartTime'], "%a, %d %b %Y %H:%M"))
    posts["ongoing"] = sorted(posts["ongoing"], key=lambda k: strptime(k['EndTime'], "%a, %d %b %Y %H:%M"))
    posts["timestamp"] = strftime("%a, %d %b %Y %H:%M:%S", localtime())

@app.route('/')
@app.cache.cached(timeout=900) # cache for 15 minutes
def index():
    
    fetch()
    
    resp = jsonify(result=posts)
    resp.status_code = 200
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port,debug=True)