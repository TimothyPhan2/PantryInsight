import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase/firebase-config";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="flex justify-center ">
      <SearchBar />
    </div>
  );
}
