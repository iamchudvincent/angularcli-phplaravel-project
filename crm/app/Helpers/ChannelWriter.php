<?php

namespace App\Helpers;

use Monolog\Logger;

use App\Helpers\ChannelStreamHandler;
use Carbon\Carbon;
use DateTime;

class ChannelWriter
{
    /**
     * The Log channels.
     *
     * @var array
     */
    protected $channels = ['event' => [ 
            'path' => 'logs/audit.log', 
            'level' => Logger::INFO 
        ],
        'audit' => [ 
            'path' => 'logs/audit.log', 
            'level' => Logger::INFO 
        ]];

    /**
     * The Log levels.
     *
     * @var array
     */
    protected $levels = [
        'debug'     => Logger::DEBUG,
        'info'      => Logger::INFO,
        'notice'    => Logger::NOTICE,
        'warning'   => Logger::WARNING,
        'error'     => Logger::ERROR,
        'critical'  => Logger::CRITICAL,
        'alert'     => Logger::ALERT,
        'emergency' => Logger::EMERGENCY,
    ];

    public function __construct() {}

    /**
     * Write to log based on the given channel and log level set
     * 
     * @param type $message
     * @param array $context
     * @throws InvalidArgumentException
     */
    public function writeLog($message, array $context=[])
    {
        $now = (new Datetime('now'))->format('Y-m-d H:i');
        $startWeek = date('Ymd', strtotime('monday this week'));
        $channel = ['path' => "logs/log_" . $startWeek . ".log", 'level' => Logger::INFO];        
        $this->channels = [$startWeek => $channel];

        if (!isset($this->channels[$startWeek]['_instance'])) {
            //create instance
            $this->channels[$startWeek]['_instance'] = new Logger($startWeek);
            //add custom handler
            $this->channels[$startWeek]['_instance']->pushHandler( 
                new ChannelStreamHandler( 
                    $startWeek, 
                    storage_path() .'/'. $this->channels[$startWeek]['path'], 
                    $this->channels[$startWeek]['level']
                )
            );
        }

        //get method name for the associated level
        $level = array_flip( $this->levels )[$this->channels[$startWeek]['level']];

        //write out record
        $this->channels[$startWeek]['_instance']->{$level}($message, $context);
        
        return $this->channels;
    }
    
    //alert('event','Message');
    function __call($func, $params){
        if(in_array($func, array_keys($this->levels))){
            return $this->writeLog($params[0], $func, $params[1]);
        }
    }

    function objectToArray ($object) {
        if(!is_object($object) && !is_array($object))
            return $object;

        return array_map('objectToArray', (array) $object);
    }
}