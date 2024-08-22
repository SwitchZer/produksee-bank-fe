import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Button from "../components/button";
import InputForm from "../components/input";
import { toast } from "react-toastify";
import axios from "axios";

const Deposito = () => {
  const [deposito, setDeposito] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editingDeposito, setEditingDeposito] = useState(null);
  const [form, setForm] = useState({
    name: "",
    yearly_return: "",
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setForm({
        name: "",
        yearly_return: "",
      });
    }
  };

  const deleteDeposito = async (depositoId) => {
    try {
      await axios.delete(
        `https://produksee-bank-be.vercel.app/v1/deposito/${depositoId}`
      );
      toast.success("Deposito deleted successfully");
      getMyDeposito();
    } catch (error) {
      toast.error("Error deleting Deposito: " + error.message);
    }
  };

  const toggleEditModal = (depositoId) => {
    const depositoToEdit = deposito.find(
      (deposito) => deposito.id === depositoId
    );
    if (depositoToEdit) {
      setForm(depositoToEdit);
      setEditingDeposito(depositoToEdit);
    }
    setIsModalEditOpen(!isModalEditOpen);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addDeposito = async () => {
    if (!form.name || !form.yearly_return) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "https://produksee-bank-be.vercel.app/v1/deposito",
        form
      );
      toast.success("Deposito added successfully");
      return response.data;
    } catch (error) {
      toast.error("Error adding Deposito: " + error.message);
      throw error;
    }
  };

  const updateDeposito = async (depositoData) => {
    try {
      const response = await axios.put(
        `https://produksee-bank-be.vercel.app/v1/deposito/${depositoData.id}`,
        depositoData
      );
      console.log("Deposito updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating Deposito:", error);
      throw error;
    }
  };

  const handleEditSubmit = async () => {
    if (editingDeposito) {
      try {
        await updateDeposito(form);
        toast.success("Customer updated successfully");
        setIsModalEditOpen(false);
        getMyDeposito();
      } catch (error) {
        toast.error("Error updating customer: " + error.message);
      }
    }
  };

  const getMyDeposito = async () => {
    try {
      const response = await axios.get(
        "https://produksee-bank-be.vercel.app/v1/deposito"
      );
      setDeposito(response.data.data);
    } catch (error) {
      console.error("Error fetching Deposito:", error);
    }
  };

  useEffect(() => {
    const getDeposito = async () => {
      try {
        const response = await axios.get(
          "https://produksee-bank-be.vercel.app/v1/deposito"
        );
        setDeposito(response.data.data);
      } catch (error) {
        console.error("Error fetching Deposito:", error);
      }
    };

    getDeposito();
  }, []);

  return (
    <>
      <div>
        <Sidebar />
        <div className="p-4 sm:ml-64">
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className="gap-4 mb-4">
              <div className="flex justify-between">
                <p className="text-2xl font-bold mb-4">Deposito List</p>
                <Button onClick={toggleModal} label="Add Deposito">
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
                      Deposito Name
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Yearly Return
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deposito.map((deposit) => (
                    <tr
                      key={deposit.id}
                      className="odd:bg-white even:bg-gray-100 border-b shadow-sm"
                    >
                      <td className="px-6 py-4">{deposit.id}</td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-black
                         whitespace-nowrap dark:text-black"
                      >
                        {deposit.name}
                      </th>
                      <td className="px-6 py-4">{deposit.yearly_return}</td>
                      <td className="px-6 py-4 flex gap-2   ">
                        <button onClick={() => toggleEditModal(deposit.id)}>
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

                        <button onClick={() => deleteDeposito(deposit.id)}>
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
                        Deposito Form
                      </h3>

                      <InputForm
                        value={form.name}
                        onChange={handleChange}
                        name="name"
                        label="Name"
                      />

                      <InputForm
                        value={form.yearly_return}
                        onChange={handleChange}
                        name="phone"
                        label="Phone Number"
                      />
                      <Button
                        onClick={addDeposito}
                        className="w-full my-4 text-white bg-black"
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

                      <InputForm
                        value={form.yearly_return}
                        onChange={handleChange}
                        name="phone"
                        label="Phone Number"
                      />
                      <Button
                        onClick={handleEditSubmit}
                        className="w-full my-4 text-white bg-black"
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

export default Deposito;
