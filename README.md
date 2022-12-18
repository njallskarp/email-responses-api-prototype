# email-responses-api-prototype

Start server:

- git clone / git pull
- start server on port 8080 with nodemon
- reroute 8080 to 80 `sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080`

# Senting POST request to create response

ENDPOINT: `https://aiprotoapi.herokuapp.com/company/639b7c5b48edf033aa9eef36/employee/639b7c7e48edf033aa9eef38/request`

Add `secret` header to post request with value `1bd4f10ce55b4a3f75aa256b10ed7718a`

Body needs to include the following JSON body:

```JSON
{
    "emailBody": "Hi,\nI'm arriving in Iceland  in February. I want to drive the ring road and need a car for 7 days starting at Feb 05.\nWhat kind of cars do you recommend? I have a 3 year old child and will I need a child seat?\nAlso, will I need a GPS when driving around the country? Thank you so much for your time.\nBest regards,\nSteve Stevensson",
    "emailSender": "John Doe",
    "emailSubject": "Car for Iceland"
}
```