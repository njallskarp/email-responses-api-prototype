# email-responses-api-prototype

Start server:

- git clone / git pull
- start server on port 8080 with nodemon
- reroute 8080 to 80 `sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080`