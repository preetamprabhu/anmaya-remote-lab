# Anmaya Remote Lab

This project is a Node.js application accessible through Cloudflare Tunnel at chukkitechnologies.com

## Prerequisites

- Node.js installed on your machine
- Domain added to Cloudflare (chukkitechnologies.com)

## Cloudflare Tunnel Setup

### 1. Install Cloudflared
##### Download the installer from:
##### https://github.com/cloudflare/cloudflared/releases

### 2. Login to Cloudflare
```bash
cloudflared login
```
Follow the browser prompt to authenticate.

### 3. Fetch the Tunnel
```bash
cloudflared tunnel create remote-lab
```
Save the Tunnel ID that is generated (you'll need it for the config file).

### 4. Create Configuration File

#### Windows:
Create config.yml in `%UserProfile%\.cloudflared\`

### 5. Configure config.yml
Copy this template and replace `<tunnel-id>` with your actual tunnel ID:
```yaml
tunnel: <tunnel-id>
credentials-file: C:\Users\YourUsername\.cloudflared\<tunnel-id>.json  # Windows path

ingress:
  - hostname: chukkitechnologies.com
    service: http://127.0.0.1:5173 # or try localhost
  - hostname: api.chukkitechnologies.com
    service: http://127.0.0.1:3000 # or try localhost
  - service: http_status:404
```

### 6. Create DNS Records
```bash
cloudflared tunnel route dns remote-lab chukkitechnologies.com
cloudflared tunnel route dns remote-lab www.chukkitechnologies.com
```

### 7. Verify DNS Records in Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Select your domain
3. Go to DNS settings
4. Add or verify these CNAME records:
   - Type: CNAME, Name: @, Target: <tunnel-id>.cfargotunnel.com
   - Type: CNAME, Name: www, Target: <tunnel-id>.cfargotunnel.com
   Both should have the orange cloud (Proxy) enabled.

## Installation

1. Clone the repository:
```bash
cd D:\website\Anmaya\anmaya-remote-lab
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Step 1: Start the Node.js Server
Open a terminal and run:
```bash
node index.js
# or
npm start
```
The server should start on port 3000. You can verify by visiting http://localhost:3000

### Step 2: Start the Cloudflare Tunnel
Open a new terminal window and run:
```bash
cloudflared tunnel run remote-lab
```

## Accessing the Application

Once both the Node.js server and Cloudflare tunnel are running, the application will be accessible at:
- https://chukkitechnologies.com
- https://www.chukkitechnologies.com

## Troubleshooting

### Check Tunnel Status
```bash
cloudflared tunnel info remote-lab
```

### Check DNS Records
Ensure these CNAME records exist in Cloudflare DNS settings:
- @ -> ccd67a21-3aa9-4ace-8411-1caaaafe6c71.cfargotunnel.com
- www -> ccd67a21-3aa9-4ace-8411-1caaaafe6c71.cfargotunnel.com

### Common Issues
1. "Site can't be reached": Make sure both Node.js app and tunnel are running
2. "Connection refused": Verify the correct port in config.yml matches your Node.js app port

## Stopping the Application

1. To stop the Node.js server: Press `Ctrl+C` in its terminal
2. To stop the tunnel: Press `Ctrl+C` in its terminal

## Additional Notes

- Keep both terminal windows open while the application is running
- The tunnel ID and configuration are specific to this setup
- For production deployment, consider running the tunnel as a service:
  ```bash
  cloudflared service install
  ``` #   a n m a y a  
 