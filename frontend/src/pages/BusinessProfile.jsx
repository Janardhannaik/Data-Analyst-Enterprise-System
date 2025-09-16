import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function BusinessProfile() {
  const [business, setBusiness] = useState({
    name: "",
    currency: "USD",
    mapping: {},
  });

  useEffect(() => {
    API.get("/businesses/my")
      .then((res) => setBusiness(res.data || business))
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/businesses", business);
      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl">Business Profile</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          value={business.name}
          onChange={(e) => setBusiness({ ...business, name: e.target.value })}
          placeholder="Business name"
        />
        <input
          value={business.currency}
          onChange={(e) =>
            setBusiness({ ...business, currency: e.target.value })
          }
          placeholder="Currency"
        />
        {/* mapping modal would go here */}
        <button className="btn" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
