<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateRecurringTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled in controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'account_id' => 'required|exists:accounts,id,user_id,' . Auth::id(),
            'category_id' => 'nullable',
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'frequency' => 'required|in:daily,weekly,monthly,yearly',
            'day_of_month' => 'required_if:frequency,monthly,yearly|nullable|integer|min:1|max:31',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ];
    }

    /**
     * Get custom validation messages
     */
    public function messages(): array
    {
        return [
            'account_id.required' => 'Please select an account.',
            'account_id.exists' => 'The selected account is invalid.',
            'type.required' => 'Please select a transaction type.',
            'type.in' => 'Transaction type must be income, expense, or transfer.',
            'amount.required' => 'Amount is required.',
            'amount.numeric' => 'Amount must be a valid number.',
            'amount.min' => 'Amount must be greater than 0.',
            'frequency.required' => 'Please select a frequency.',
            'frequency.in' => 'Invalid frequency selected.',
            'day_of_month.required_if' => 'Day of month is required for monthly and yearly frequencies.',
            'day_of_month.min' => 'Day of month must be between 1 and 31.',
            'day_of_month.max' => 'Day of month must be between 1 and 31.',
            'start_date.required' => 'Start date is required.',
            'end_date.after' => 'End date must be after start date.',
        ];
    }
}
