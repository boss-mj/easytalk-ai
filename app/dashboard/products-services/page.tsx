"use client";

import { Pencil, Trash2, Plus } from "lucide-react";

const products = [
  {
    name: "Vendo Water",
    category: "Water",
    price: "₱30.00",
    status: "Active",
  },
  {
    name: "Coffee",
    category: "Drinks",
    price: "₱30.00",
    status: "Active",
  },
  {
    name: "Milk Tea",
    category: "Drinks",
    price: "₱45.00",
    status: "Active",
  },
  {
    name: "Nachos",
    category: "Snacks",
    price: "₱35.00",
    status: "Active",
  },
  {
    name: "Soda",
    category: "Drinks",
    price: "₱25.00",
    status: "Inactive",
  },
];

export default function ProductsServicesCard() {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Products / Services
        </h2>

        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-4 font-medium">Product Name</th>
              <th className="pb-4 font-medium">Category</th>
              <th className="pb-4 font-medium">Price</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                <td className="py-5 font-medium text-gray-900">
                  {product.name}
                </td>

                <td className="py-5 text-gray-600">
                  {product.category}
                </td>

                <td className="py-5 text-gray-900 font-medium">
                  {product.price}
                </td>

                <td className="py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="py-5">
                  <div className="flex items-center justify-center gap-3">
                    <button className="w-8 h-8 rounded-lg border hover:bg-gray-100 flex items-center justify-center">
                      <Pencil
                        size={15}
                        className="text-gray-500"
                      />
                    </button>

                    <button className="w-8 h-8 rounded-lg border hover:bg-red-50 flex items-center justify-center">
                      <Trash2
                        size={15}
                        className="text-red-500"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-5 text-sm text-gray-500">
        Showing 1 to 5 of 5 products
      </div>
    </div>
  );
}