from flask import *

app = Flask(__name__)
room_id_counter=0
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

if __name__=='__main__':
    app.run(host="0.0.0.0", port=80)
