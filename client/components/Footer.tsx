import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Make sure this exists
import { supabase } from '../supabaseClient';
import { useState } from "react";
import PremiumAlert from "./PremiumAlert";

export default function Footer() {
const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleClick = async (e) => {
     if (!email) {
      alert('Kindly enter a valid email');
      return;
    }
     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address");
    }
       const { data, error } = await supabase
      .from('leads') // your table name
      .insert([{ email }]);
       if (error) {
        if(error.code = "23505"){alert('Thank you for visiting us!!');}
        else{
          alert('There is an error. Please retry later');
        }
    } 
    else{
     alert('Thank you for visiting us!!');
    }
  };

  return (
  <footer className="bg-gray-900 text-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src = "/public/assets/Logo.png" width="50" height="60"/>
              <p className="text-gray-400 text-sm">
                Empowering businesses with intelligent customer support
                solutions.
              </p>
            </div>

         

            <div >
              <h4 className="font-semibold mb-4">Sign up for our newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest updates and insights delivered to your inbox.
              </p>
              <div className="flex">
                <input
                  type="email"
                  value={email}
        onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 text-sm"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-r-lg" onClick = {() => handleClick(email)}>
                  →
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Support AI. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link to="/contact" className="hover:text-white">
                Support
              </Link>
            </div>
          </div>
          </div>
      </footer>
  );
}
