<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class TextMailable extends Mailable
{
    use Queueable, SerializesModels;

    private $emailTo;
    private $data;
    private $replyName;
    private $replyAdd;
    private $emailCC;
    private $template;
    private $emailFrom;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($template, $email, $subject, $data, $replyName, $replyAdd, $emailCC, $from = "")
    {
        $this->template = $template;
        $this->emailTo = $email;
        $this->subject = $subject;
        $this->data = $data;
        $this->replyName = $replyName;
        $this->replyAdd = $replyAdd;
        $this->emailCC = $emailCC;
        $this->emailFrom = $from ? $from : env('EMAIL_SENDER','mail@qqenglish.jp');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        if( !empty($this->replyName) && !empty($this->replyAdd) )
            $this->replyTo($this->replyAdd, $this->replyName);

        return $this->to($this->emailTo)
            ->from($this->emailFrom, 'QQENGLISH')
            ->cc($this->emailCC)
            ->text($this->template)->with([
                'data' => $this->data
            ]);
    }
}
