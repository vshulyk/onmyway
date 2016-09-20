from fabric.api import env
from fabric.operations import run, put, local
from fabric.context_managers import cd

env.hosts = ['omw-user@onmyway.ga']

def deploy():
    local("webpack -p")    
    put('bundle.js', '/var/www/vhosts/onmyway.ga/htdocs')
    put('index.html', '/var/www/vhosts/onmyway.ga/htdocs')
    put('img', '/var/www/vhosts/onmyway.ga/htdocs')
    put('style', '/var/www/vhosts/onmyway.ga/htdocs')
    put('server', '/var/www/vhosts/onmyway.ga')
    put('server/config.js.nossl', '/var/www/vhosts/onmyway.ga/server/config.js')
    put('package.json', '/var/www/vhosts/onmyway.ga/server')
    with cd('/var/www/vhosts/onmyway.ga/server'):
        run('npm install')

    # restart node