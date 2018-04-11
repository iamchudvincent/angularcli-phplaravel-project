<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ];
    }

    public function messages()
    {
        $errorcodes = config('errorcodes.user');
        return [
            'email.required' => $errorcodes['email_required']['key'],
            'email.email' => $errorcodes['email_invalid']['key'],
            'password.required' => $errorcodes['password_required']['key'],
            'password.min' => $errorcodes['password_less_6']['key'],
        ];
    }
}
