//NPM MODULE
const express = require('express');
const dotenv = require("dotenv").config();


class CheckerLinks {

    static linksTest(url, setings) {
        global.links = [];
        return CheckerLinks.test(url, setings);
    }
    static async test(url, setings) {
        try {
        await fetch(url, setings).then(async (res) => {
            
                links.push({
                    url,
                    status: res.status
                });


                if (res.headers.get('Location') !== url
                    && (res.status === 301
                        || res.status === 302)) {

                    await CheckerLinks.test(res.headers.get('Location'), setings);

                } else {

                    return links;

                }
            })} catch  {
                return ("Ohh NO! This is invalid url");
            }
        
    return links

    }

}
module.exports = CheckerLinks