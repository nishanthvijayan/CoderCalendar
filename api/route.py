import os
from flask import Flask, jsonify
import mechanize
from bs4 import BeautifulSoup

app = Flask(__name__)


def getData():
    
    posts= []
    
    browser = mechanize.Browser()
    browser.set_handle_robots(False)
    cookies = mechanize.CookieJar()
    browser.addheaders = [('User-agent', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:25.0) Gecko/20100101 Firefox/25.0')]

    page = browser.open("http://www.codechef.com/contests")
    soup = BeautifulSoup(page,"html.parser")

    statusdiv = soup.findAll("div",attrs = {"id":"statusdiv"})
    ongoing_contests = statusdiv[0].findAll("tr")
    for ongoing_contest in ongoing_contests[1:]:
        details = ongoing_contest.findAll("td")
        posts.append({ "Code" : details[0].string    ,"Name" :  details[1].string  , "url" : "www.codechef.com"+details[1].a["href"] , "StartTime" : details[2].string ,"Endtime" : details[3].string })
        

    upcoming_contests = statusdiv[1].findAll("tr")
    for upcoming_contest in upcoming_contests[1:]:
        details = upcoming_contest.findAll("td")
        posts.append({ "Code" : details[0].string    ,"Name" :  details[1].string  , "url" : "www.codechef.com"+details[1].a["href"] , "StartTime" : details[2].string ,"Endtime" : details[3].string })
        
    
    return posts




@app.route('/')
@app.route('/data.json')
def index():
    
    results = getData()
    list = [ {'Posts':  results   } ]
    resp = jsonify(result=results)
    resp.status_code = 200
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


if __name__ == '__main__':
    #app.run(debug=True)
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port,debug=True)