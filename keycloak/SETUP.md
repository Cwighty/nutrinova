In an attempt to never be a "Brent" again here is how the keycloak realm should be set up.
# New Linux Box Setup
1. Install new github action runner 
    - https://docs.github.com/en/actions/hosting-your-own-runners/adding-self-hosted-runners
    - Start it as a service `sudo ./svc.sh install`

2. Install docker
    ```bash
    sudo apt-get update
    curl -fsSL get.docker.com -o get-docker.sh
    sudo sh get-docker.sh

    sudo sh -eux <<EOF
        # Install newuidmap & newgidmap binaries
        apt-get install -y uidmap
    EOF

    dockerd-rootless-setuptool.sh install
    curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash
    sudo systemctl enable docker.service
    loginctl enable-linger
    ```

3. Run the github action

# Keycloak Setup
1. Create a new realm
    - Name: `nutrinova`

2. Create a new client
    - Client ID: `nutrinova-ui`

3. Don't touch anything on the next page

4. Add these to the callback urls
    - `http://localhost:3000/api/auth/callback/oidc`
    - `https://localhost:3000/api/auth/callback/oidc`
    - `https://nutrinova.duckdns.org:1359/api/auth/callback/oidc`

That is all, don't touch anything else, this should work. 

## Turn on User Registration
1. `Realm Settings` -> `Login`
2. User Registration ON
