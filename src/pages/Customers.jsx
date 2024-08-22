import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import InputForm from "../components/input";
import Button from "../components/button";
import { toast } from "react-toastify";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState({
    name: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setForm({
        name: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
      });
    }
  };

  const toggleEditModal = (customerId) => {
    const customerToEdit = customers.find(
      (customer) => customer.id === customerId
    );
    if (customerToEdit) {
      setForm(customerToEdit);
      setEditingCustomer(customerToEdit);
    }
    setIsModalEditOpen(!isModalEditOpen);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addCustomers = async () => {
    if (
      !form.name ||
      !form.gender ||
      !form.phone ||
      !form.email ||
      !form.address
    ) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Invalid email format");
      return;
    }

    const phoneRegex = /^\d{12,14}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("Phone number must be between 12 and 14 digits");
      return;
    }

    try {
      const response = await axios.post(
        "https://produksee-bank-be.vercel.app/v1/customers",
        form
      );
      toast.success("Customer added successfully");
      return response.data;
    } catch (error) {
      toast.error("Error adding customer: " + error.message);
      throw error;
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await axios.delete(
        `https://produksee-bank-be.vercel.app/v1/customers/${customerId}`
      );
      toast.success("Customer deleted successfully");
    } catch (error) {
      toast.error("Error deleting customer: " + error.message);
    }
  };

  const updateCustomers = async (customerData) => {
    try {
      const response = await axios.put(
        `https://produksee-bank-be.vercel.app/v1/customers/${customerData.id}`,
        customerData
      );
      console.log("Customer updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  };

  const handleEditSubmit = async () => {
    if (editingCustomer) {
      try {
        await updateCustomers(form);
        toast.success("Customer updated successfully");
        setIsModalEditOpen(false);
        getMyCustomers();
      } catch (error) {
        toast.error("Error updating customer: " + error.message);
      }
    }
  };

  const getMyCustomers = async () => {
    try {
      const response = await axios.get(
        "https://produksee-bank-be.vercel.app/v1/customers"
      );
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "https://produksee-bank-be.vercel.app/v1/customers"
        );
        setCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <>
      <div>
        <Sidebar />
        <div className="p-4 sm:ml-64">
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className="gap-4 mb-4">
              <div className="flex justify-between">
                <p className="text-2xl font-bold mb-4">Customers List</p>
                <Button onClick={toggleModal} label="Add Customer">
                  Toggle modal
                </Button>
              </div>

              <table className="w-full text-sm text-left rtl:text-right text-black shadow-lg border border-gray-300 rounded-lg overflow-hidden">
                <thead className="text-xs text-black uppercase bg-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Id
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Customer Name
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Gender
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Phone Number
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="odd:bg-white even:bg-gray-100 border-b shadow-sm"
                    >
                      <td className="px-6 py-4">{customer.id}</td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-black
                         whitespace-nowrap dark:text-black"
                      >
                        {customer.name}
                      </th>
                      <td className="px-6 py-4">{customer.gender}</td>
                      <td className="px-6 py-4">{customer.phone}</td>
                      <td className="px-6 py-4">{customer.email}</td>
                      <td className="px-6 py-4 flex gap-2   ">
                        <button onClick={() => toggleEditModal(customer.id)}>
                          <svg
                            className="w-6 h-6 text-gray-800 dark:text-black"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                            />
                          </svg>
                        </button>

                        <button onClick={() => deleteCustomer(customer.id)}>
                          <svg
                            className="w-6 h-6 text-gray-800 dark:text-black"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                id="crud-modal"
                tabIndex="-1"
                aria-hidden="true"
                className={`fixed top-0 left-0 right-0 bottom-0 z-50 ${
                  isModalOpen ? "flex" : "hidden"
                } items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50`}
              >
                <div className="relative w-full max-w-md max-h-full">
                  <div className="relative bg-gray-100 rounded-lg shadow-lg dark:bg-gray-200">
                    <button
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-300 dark:hover:text-black"
                      data-modal-hide="crud-modal"
                      onClick={toggleModal}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                    <div className="px-6 py-6 lg:px-8">
                      <h3 className="mb-4 text-xl font-medium text-black">
                        Customers Form
                      </h3>

                      <InputForm
                        value={form.name}
                        onChange={handleChange}
                        name="name"
                        label="Name"
                      />
                      <div>
                        <label
                          htmlFor="gender"
                          className="block mb-2 text-sm font-medium text-black"
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                          <option value="">Select Your Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <InputForm
                        value={form.phone}
                        onChange={handleChange}
                        name="phone"
                        label="Phone Number"
                      />
                      <InputForm
                        value={form.email}
                        onChange={handleChange}
                        name="email"
                        type="email"
                        label="Email"
                      />
                      <div>
                        <label
                          htmlFor="address"
                          className="block mb-2 text-sm font-medium text-black"
                        >
                          Address
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <Button
                        onClick={addCustomers}
                        className="w-full my-4 text-white"
                        label="Add Customer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="crud-modal"
                tabIndex="-1"
                aria-hidden="true"
                className={`fixed top-0 left-0 right-0 bottom-0 z-50 ${
                  isModalEditOpen ? "flex" : "hidden"
                } items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50`}
              >
                <div className="relative w-full max-w-md max-h-full">
                  <div className="relative bg-gray-100 rounded-lg shadow-lg dark:bg-gray-200">
                    <button
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-300 dark:hover:text-black"
                      data-modal-hide="crud-modal"
                      onClick={() => setIsModalEditOpen(false)}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                    <div className="px-6 py-6 lg:px-8">
                      <h3 className="mb-4 text-xl font-medium text-black">
                        Customers Form
                      </h3>
                      <InputForm
                        value={form.name}
                        onChange={handleChange}
                        name="name"
                        label="Name"
                      />
                      <div>
                        <label
                          htmlFor="gender"
                          className="block mb-2 text-sm font-medium text-black"
                        >
                          Gender
                        </label>
                        <select
                          id="edit-gender"
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                          <option value="">Select Your Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <InputForm
                        value={form.phone}
                        onChange={handleChange}
                        name="phone"
                        label="Phone Number"
                        id="edit-phone"
                      />
                      <InputForm
                        value={form.email}
                        onChange={handleChange}
                        name="email"
                        type="email"
                        label="Email"
                        id="edit-email"
                      />
                      <div>
                        <label
                          htmlFor="address"
                          className="block mb-2 text-sm font-medium text-black"
                        >
                          Address
                        </label>
                        <textarea
                          id="edit-address"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <Button
                        onClick={handleEditSubmit}
                        className="w-full my-4 text-white"
                        label="Add Customer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
