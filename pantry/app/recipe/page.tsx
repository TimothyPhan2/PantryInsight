"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { supabaseClient } from "@/utils/supabase/client";

export default function RecipePage() {
  const { user, isSignedIn } = useUser();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  interface Recipe {
    recipe_name: string;
    description: string;
    ingredients: {
      quantity: number;
      unit: string;
      name: string;
    }[];
    directions: string[];
  }
  interface PantryItem {
    id: number;
    name: string;
    quantity: number;
    user_id: string;
    expiration: string;
  }

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const handleIngredientSelect = (value: string) => {
    if (selectedIngredients.includes(value)) {
      setSelectedIngredients(
        selectedIngredients.filter((item) => item !== value)
      );
    } else {
      setSelectedIngredients([...selectedIngredients, value]);
    }
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/llama", {
        message: selectedIngredients.toLocaleString(),
      });
      console.log(response.data);
      console.log(response.data.choices[0]?.message?.content || "");
      setRecipe(JSON.parse(response.data.choices[0]?.message?.content));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (!isSignedIn) return;

      const { data: pantryItems, error } = await supabaseClient
        .from("PantryItems")
        .select("*")
        .eq("user_id", user?.id);
      if (error) {
        console.error(error);
      } else {
        setIngredients(pantryItems);
      }
    };
    fetchItems();
  }, [isSignedIn, user]);

  console.log(ingredients);
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-3xl font-bold">Recipe Generator</h1>
      </header>
      <main className="flex-1 bg-background p-8 md:p-12 lg:p-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Find a Recipe</h2>
            <p className="text-muted-foreground">
              Select the ingredients you have and we'll generate a recipe for
              you.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {selectedIngredients.length > 0
                      ? selectedIngredients.join(", ")
                      : "Select ingredients"}
                    <ChevronDownIcon className="ml-auto h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {ingredients.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No ingredients found. Please add some ingredients to your
                      pantry.
                    </div>
                  ) : (
                    ingredients.map((ingredient) => (
                      <DropdownMenuCheckboxItem
                        key={ingredient.id}
                        checked={selectedIngredients.includes(ingredient.name)}
                        onCheckedChange={() =>
                          handleIngredientSelect(ingredient.name)
                        }
                      >
                        {ingredient.name}
                      </DropdownMenuCheckboxItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Recipe"}
            </Button>
          </form>
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent" />
            </div>
          )}
          {!isLoading && recipe && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Recipe</h2>
              <div className="bg-card text-card-foreground rounded-lg p-6 shadow">
                <h3 className="text-xl font-bold">{recipe.recipe_name}</h3>
                <p className="text-muted-foreground">{recipe.description}</p>
                <div className="space-y-2 mt-4">
                  <h4 className="font-bold">Ingredients:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {recipe.ingredients.map(
                      (ingredient: any, index: number) => (
                        <li key={index}>
                          {ingredient.quantity} {ingredient.unit}{" "}
                          {ingredient.name}
                        </li>
                      )
                    )}
                  </ul>
                  <h4 className="font-bold">Instructions:</h4>
                  <ol className="list-decimal pl-6 space-y-1">
                    {recipe.directions.map(
                      (direction: string, index: number) => (
                        <li key={index}>{direction}</li>
                      )
                    )}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
