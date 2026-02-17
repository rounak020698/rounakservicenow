import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '29cb76bb90b447afb4e76f7036319e51'
                    }
                    incident_form_page: {
                        table: 'sys_ui_page'
                        id: 'f590097ebf984e9b91cd23db56dbf054'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'b11052f780344b4bb48747f5bc5fe14c'
                    }
                    'x_1835748_incident/main': {
                        table: 'sys_ux_lib_asset'
                        id: '58cd079b2a9442a3a2dc806eeab48d9c'
                        deleted: false
                    }
                    'x_1835748_incident/main.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: 'bf0a0774ccab49c282291a43a25eecde'
                        deleted: false
                    }
                }
            }
        }
    }
}
