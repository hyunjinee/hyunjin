use std::net::TcpListener;
use std::io::{Read, Write};

fn main() {
    // 서버를 초기화해서 IP 주소 127.0.0.1와 포트 3000에 바인딩한다
    let connection_listener = TcpListener::bind("127.0.0.1:3000").unwrap();
    println!("Running on port 3000");
    // 소켓 서버는 유입되는 커넥션을 기다린다
    for stream in connection_listener.incoming() {
        let mut stream = stream.unwrap();
 
        println!("Connection established");

        let mut buffer = [0; 1024];

        stream.read(&mut buffer).unwrap();
        stream.write(&mut buffer).unwrap();
    }
}
