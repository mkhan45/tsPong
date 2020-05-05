from flask import Flask

app = Flask(__name__)
room_id_counter=0
@app.route('/create_room'):
    url='/room/'+str(room_id_counter)+'/initiator'
    room_id_counter+=1
    return redirect(url)

if __name__=='__main__':
    app.run(debug=True)
