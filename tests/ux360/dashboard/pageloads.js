module.exports = {
    "dashboard loads" : function (browser) {
        browser
            .resizeWindow(1280, 1024)
            .url("http://personamodeler.com:8082/web/guest/login")
            .waitForElementVisible('body', 5000)
            .setValue('input[name="_uxmsignin_WAR_uxmplugin_login"]', 'mundi@tandemseven.com')
            .setValue('input[name="_uxmsignin_WAR_uxmplugin_password"]', 'mundi')
            .setValue('input[name="_uxmsignin_WAR_uxmplugin_companyCode"]', 'development')
            .submitForm('form[name="_uxmsignin_WAR_uxmplugin_fm"]')
            .pause('5000')
            .assert.title('UX360 | Dashboard')
            .end();
    }
};
