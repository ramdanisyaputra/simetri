<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $userId = Auth::user()->id;
        
        // Get user-specific categories
        $userCategories = Category::where('user_id', $userId)
            ->orderBy('type')
            ->orderBy('name')
            ->get();
            
        // Get system default categories (user_id is null)
        $defaultCategories = Category::whereNull('user_id')
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        $data = [
            'userCategories' => $userCategories,
            'defaultCategories' => $defaultCategories,
        ];

        return Inertia::render('Categories/Index', $data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:expense,income',
            'icon' => 'nullable|string|max:100',
        ]);

        // Check if user already has a category with this name and type
        $existingCategory = Category::where('user_id', Auth::user()->id)
            ->where('name', $request->name)
            ->where('type', $request->type)
            ->first();

        if ($existingCategory) {
            return redirect()->route('categories.index')
                ->with('error', 'You already have a category with this name and type.');
        }

        Category::create([
            'user_id' => Auth::user()->id,
            'name' => $request->name,
            'type' => $request->type,
            'icon' => $request->icon,
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        // Ensure user can only update their own categories
        if ($category->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized access to this category.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:expense,income',
            'icon' => 'nullable|string|max:100',
        ]);

        // Check if user already has another category with this name and type
        $existingCategory = Category::where('user_id', Auth::user()->id)
            ->where('name', $request->name)
            ->where('type', $request->type)
            ->where('id', '!=', $category->id)
            ->first();

        if ($existingCategory) {
            return redirect()->route('categories.index')
                ->with('error', 'You already have another category with this name and type.');
        }

        $category->update([
            'name' => $request->name,
            'type' => $request->type,
            'icon' => $request->icon,
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        // Ensure user can only delete their own categories
        if ($category->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized access to this category.');
        }

        // Check if category is being used in any transactions
        if ($category->transactions()->count() > 0) {
            return redirect()->route('categories.index')
                ->with('error', 'Cannot delete category that has transactions associated with it.');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
