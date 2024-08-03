"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabaseClient } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import DataTable from "./DataTable";
export default function PantryManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    expiration: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { error } = await supabaseClient.from("PantryItems").insert([
      {
        name: form.name,
        quantity: form.quantity,
        user_id: user?.id,
        expiration: form.expiration,
      },
    ]);
    if (error) {
      console.error(error);
    } else {
      console.log("Product added successfully");
      setForm({
        name: "",
        quantity: 1,
        expiration: "",
      });
    }
  };
  return (
    <>
      <header className="px-4 sm:px-6 flex justify-center items-center h-16">
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md  w-full"
          />
        </div>
        <Button
          size="sm"
          className="ml-4 bg-accent-700 "
          onClick={() => setIsModalOpen(true)}
        >
          Add Item
        </Button>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details for the new product you want to add.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Product Name"
                    className="col-span-3"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="10"
                    className="col-span-3"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="item-expiration" className="text-right">
                    Expiration Date
                  </Label>
                  <Input
                    id="item-expiration"
                    type="date"
                    className="col-span-3"
                    name="expiration"
                    value={form.expiration}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Save Product</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>
      <DataTable searchQuery={searchQuery} />
    </>
  );
}
