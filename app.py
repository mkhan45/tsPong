from flask import *

app = Flask(__name__)
room_id_counter=0
conn_info=dict()
@app.route('/hello')
def hello():
    return 'hello there'
@app.route('/')
def main():
    return render_template('index.html')
@app.route('/create_room')
def create():
    global room_id_counter
    url='/room/'+str(room_id_counter)+'/initiator'
    room_id_counter+=1
    return redirect(url)

@app.route('/room/<num>/initiator')
def initiator(num):
    return render_template('initiator.html')

@app.route('/room/<num>/observer')
def observer(num):
    return render_template('observer.html')

@app.route('/room/<num>/signal',methods=['POST'])
def signal(num):
    global conn_info 
    conn_info[num]=['' for _ in range(2)]
    conn_info[num][0]=request.form['c_info']
    return 'success!!'
@app.route('/room/<num>/getsignal',methods=['POST'])
def getsignal(num):
    return conn_info[num][0]
@app.route('/room/<num>/accept',methods=['POST'])
def accept_conn(num):
    global conn_info 
    conn_info[num][1]=request.form['c_info']
    return 'success!!'
@app.route('/room/<num>/getaccept',methods=['POST'])
def get_accept(num):
    return conn_info[num][1]
if __name__=='__main__':
    app.run(host="0.0.0.0", port=80)
