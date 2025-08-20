# CSE-135-1deca.de

## Username/password Info for Logging into the Site
- Username: **aiden**
- Password: **pass135**

## Links
- [HW2 README](./doc/HW2-README.md)

- HW1
    - [Homepage](https://1deca.de)
    - [Member: Xiaogeng Xu](https://1deca.de/members/xiaogengxu.html)
    - [Collector](https://collector.1deca.de)
    - [Reporting](https://reporting.1deca.de)
    - [PHP](https://1deca.de/hello.php)
    - [robots.txt](https://www.1deca.de/robots.txt)
    - [404](https://www.1deca.de/404)
    - [GoAccess Report](https://1deca.de/report.html)
    - [favicon](https://www.1deca.de/images/favicon.ico)

## Details of Github Auto Deploy Setup
### Approach
Use **GitHub Actions** to handle the deployment via **SSH**
### Setup Steps
1. **Create a GitHub repository** for the project.

2. **Generate an SSH key pair** on the server:
   ```bash
   ssh-keygen -t ed25519
    ```
3. Add the public key to
    ```bash
    ~/.ssh/authorized_keys
    ```
4. **Initialize Git** inside web root (server)
    ```bash
    cd /var/www/1deca.de/public_html
    git init
    ```
5. Add **GitHub Secrets** in
    [Settings >> Secrets and variables >> Actions]:
    ```
    SERVER_USER — SSH username

    SERVER_IP — Server IP address

    SSH_PRIVATE_KEY — Contents of github_actions_key private key
    ```
6. Connect the server repo to GitHub
    ```bash
    git remote add origin [github repo link]
    ```
7. Pull from GitHub and resolve any merge conflicts
    ```bash
    git pull origin main --allow-unrelated-histories
    ```
8. **Create the GitHub Actions workflow** in ```.github/workflows/deploy.yml``` in the repository
    > My [deploy.yml](./\.github/workflows/deploy.yml)   

9. Push files from the server to GitHub
10. Clone the repo to the local development machine

### Deployment Process
1. Developer commits and pushes changes to main branch.
2. GitHub Actions triggers the deploy.yml workflow.
3. Workflow checks out latest code and connects to the server via SSH.
4. On the server, it pulls the latest code into ```/var/www/[domain]/public_html```.
5. Website updates automatically.

## Summary of Changes to HTML File in DevTools after Compression
The HTML file now shows `content-encoding: gzip` in the Response Headers, which means it’s being compressed. Also, I can also see two different numbers for **transferred** size and **resource** size, showing the file is smaller when sent over the internet.
## Summary of Removing 'server' header
1. Install mod_security
    ```bash
    sudo apt install libapache2-mod-security2
    ```
2. Enable the mod_security module
    ```bash
    sudo a2enmod security2
    ```
3. Edit Apache security config
    ```bash
    sudo nano /etc/apache2/conf-available/security.conf
    ```
    Add and update these lines inside the file
    ```bash
    ServerTokens Full
    ServerSignature Off
    SecServerSignature "CSE135 Server"
    ```
4. Restart Apache to apply changes
    ```bash
    sudo systemctl restart apache2
    ```