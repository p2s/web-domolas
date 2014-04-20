<?php

Atomik::set(array(

    'plugins' => array(
        'DebugBar' => array(
            // if you don't include jquery yourself as it is done in the
            // skeleton, comment out this line (the debugbar will include jquery)
            'include_vendors' => 'css'
        ),
        'Errors' => array(
            'catch_errors' => true
        ),
        'Session',
        'Flash',
        'Db' => array(
            'dsn' => 'sqlite:/home/pi/dev/domolas/domolas/db/domolas.db'
        ),
        'Ajax' => array(
            'allowed' => array(
                'jsonDataAction'
            )
        )
    ),

    'app.layout' => '_layout',

    'url_rewriting' => true,

    // WARNING: change this to false when in production
    'atomik.debug' => true
    
));
