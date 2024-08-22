import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import InputForm from "../components/input";
import Button from "../components/button";
import axios from "axios";
import { toast } from "react-toastify";

const Accounts = () => {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [deposito, setDeposito] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    packet: "",
    balance: "",
    customer_id: "",
    deposito_id: "",
    accounts_id: "",
    type: "",
    nominal: "",
  });

  const calculateEndingBalance = (startingBalance, createdAt, yearlyRate) => {
    const now = new Date();
    const creationDate = new Date(createdAt);
    const monthsDiff =
      (now.getFullYear() - creationDate.getFullYear()) * 12 +
      (now.getMonth() - creationDate.getMonth());
    const monthlyReturn = yearlyRate / 12 / 100; // Convert yearly rate to monthly decimal
    return startingBalance * (1 + monthlyReturn * monthsDiff);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setForm({
        packet: "",
        balance: "",
        customer_id: "",
        deposito_id: "",
      });
    }
  };

  const toggleDetailModal = (accountId) => {
    setIsModalDetailOpen(!isModalDetailOpen);
    setSelectedAccountId(accountId);
    if (!isModalDetailOpen) {
      setForm({
        Type: "",
        nominal: "",
      });
      fetchTransactions(accountId);
    }
  };

  const fetchTransactions = async (accountId) => {
    try {
      const response = await axios.get(
        `https://produksee-bank-be.vercel.app/v1/transactions/${accountId}`
      );
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error fetching transactions");
    }
  };

  const addTransaction = async () => {
    if (!selectedAccountId) {
      toast.error("No account selected");
      return;
    }

    try {
      const transactionData = {
        accounts_id: selectedAccountId,
        type: form.type,
        nominal: form.nominal,
      };

      const response = await axios.post(
        "https://produksee-bank-be.vercel.app/v1/transactions",
        transactionData
      );

      setTransactions([...transactions, response.data.data]);
      toast.success("Transaction added successfully");

      // Reset form
      setForm({
        type: "",
        nominal: "",
      });

      // Refresh transactions
      fetchTransactions(selectedAccountId);
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Error: " + error.message);
    }
  };

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

  const fetchDeposito = async () => {
    try {
      const response = await axios.get(
        "https://produksee-bank-be.vercel.app/v1/deposito"
      );
      setDeposito(response.data.data);
    } catch (error) {
      console.error("Error fetching Deposito:", error);
    }
  };

  const getAccounts = async () => {
    try {
      const response = await axios.get(
        "https://produksee-bank-be.vercel.app/v1/accounts"
      );
      setAccounts(response.data.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  const addAccount = async () => {
    try {
      const accountResponse = await axios.post(
        "https://produksee-bank-be.vercel.app/v1/accounts",
        form
      );
      setAccounts([...accounts, accountResponse.data]);
      toast.success("Account added successfully");

      const transactionData = {
        accounts_id: accountResponse.data.data.id,
        nominal: form.balance,
        type: "Deposit",
      };

      await axios.post(
        "https://produksee-bank-be.vercel.app/v1/transactions",
        transactionData
      );
      toast.success("Initial deposit transaction created successfully");
    } catch (error) {
      console.error("Error adding account or creating transaction:", error);
      toast.error("Error: " + error.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchCustomers();
    fetchDeposito();
  }, []);

  return (
    <>
      <div>
        <Sidebar />
        <div className="p-4 sm:ml-64">
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className="gap-4 mb-4">
              <div className="flex justify-between">
                <p className="text-2xl font-bold mb-4">Account List</p>
                <Button onClick={toggleModal} label="Add Account">
                  Toggle modal
                </Button>
              </div>

              <select
                id="customer"
                name="customer_id"
                value={form.customer_id}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value) {
                    axios
                      .get(
                        `https://produksee-bank-be.vercel.app/v1/accounts/customer/${e.target.value}`
                      )
                      .then((response) => {
                        setAccounts(response.data.data);
                      })
                      .catch((error) => {
                        console.error(
                          "Error fetching customer accounts:",
                          error
                        );
                      });
                  } else {
                    getAccounts();
                  }
                }}
                className="bg-white outline-none text-black border my-2 border-gray-300 text-sm rounded-lg block w-full p-2.5 shadow-md"
              >
                <option value="">All Accounts</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <table className="w-full text-sm text-left rtl:text-right text-black shadow-lg border border-gray-300 rounded-lg overflow-hidden">
                <thead className="text-xs text-black uppercase bg-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Id
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Account Name
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Customer Name
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Deposito Type
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Yearly Return
                    </th>
                    <th scope="col" className="px-6 py-3 border-gray-300">
                      Created Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 border-b border-gray-300"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="odd:bg-white even:bg-gray-100 border-b shadow-sm"
                    >
                      <td className="px-6 py-4">{account.id}</td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-black
                         whitespace-nowrap dark:text-black"
                      >
                        {account.packet}
                      </th>
                      <td className="px-6 py-4">{account.customer_name}</td>
                      <td className="px-6 py-4">{account.deposito_type}</td>
                      <td className="px-6 py-4">{account.yearly_rate}</td>
                      <td className="px-6 py-4">
                        {new Date(account.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => toggleDetailModal(account.id)}>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                id="add-account-modal"
                tabIndex="-1"
                aria-hidden="true"
                className={`fixed top-0 left-0 right-0 bottom-0 z-50 ${
                  isModalOpen ? "flex" : "hidden"
                } items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50`}
              >
                <div className="relative w-full max-w-md max-h-full">
                  <div className="relative bg-gray-100 rounded-lg shadow-lg dark:bg-gray-100">
                    <button
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-300 dark:hover:text-black"
                      id="add-account-modal"
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
                        Account Form
                      </h3>

                      <InputForm
                        value={form.packet}
                        onChange={handleChange}
                        name="packet"
                        label="Packet"
                      />
                      <div className="my-2">
                        <label
                          htmlFor="customer"
                          className="block mb-2 text-sm font-medium text-black"
                        >
                          Select Customer
                        </label>
                        <select
                          id="customer-account"
                          name="customer_id"
                          value={form.customer_id}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">Select a customer</option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <InputForm
                        value={form.balance}
                        onChange={handleChange}
                        name="balance"
                        label="Balance"
                      />
                      <div className="my-2">
                        <label
                          htmlFor="deposito"
                          className="block mb-2 text-sm font-medium text-black"
                        >
                          Select Deposito
                        </label>
                        <select
                          id="deposito"
                          name="deposito_id"
                          value={form.deposito_id}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">Select a deposito</option>
                          {deposito.map((deposit) => (
                            <option key={deposit.id} value={deposit.id}>
                              {deposit.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        onClick={addAccount}
                        className="w-full my-4 text-white"
                        label="Add Account"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="transaction-detail-modal"
                tabIndex="-1"
                aria-hidden="true"
                className={`fixed top-0 left-0 right-0 bottom-0 z-50 ${
                  isModalDetailOpen ? "flex" : "hidden"
                } items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50`}
              >
                <div className="relative w-full max-w-4xl max-h-full">
                  <div className="relative bg-gray-100 rounded-lg shadow-lg dark:bg-gray-100">
                    <button
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-300 dark:hover:text-black"
                      id="transaction-detail-modal"
                      onClick={() => setIsModalDetailOpen(false)}
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
                    <div className="px-6 py-6 lg:px-8 flex">
                      <div className="w-3/4 pr-4">
                        <h3 className="mb-4 text-xl font-medium text-black">
                          Transaction History
                        </h3>
                        <div className="overflow-x-auto">
                          <div className="max-h-[320px] overflow-y-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                <tr>
                                  <th scope="col" className="px-6 py-3">
                                    ID
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Type
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Nominal
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Date
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {transactions.map((transaction, index) => (
                                  <tr
                                    key={transaction.id}
                                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${
                                      index >= 4 ? "overflow-row" : ""
                                    }`}
                                  >
                                    <td className="px-6 py-4">
                                      {transaction.id}
                                    </td>
                                    <td className="px-6 py-4">
                                      {transaction.type}
                                    </td>
                                    <td className="px-6 py-4">
                                      {transaction.nominal}
                                    </td>
                                    <td className="px-6 py-4">
                                      {new Date(
                                        transaction.created_at
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="w-1/4 pl-4">
                        <h3 className="mb-4 text-xl font-medium text-black">
                          Transaction Form
                        </h3>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-black">
                            Transaction Type
                          </label>
                          <select
                            id="transactionType"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                          >
                            <option disabled>Select Transaction Type</option>
                            <option value="Withdraw">Withdraw</option>
                            <option value="Deposit">Deposit</option>
                          </select>
                        </div>
                        <InputForm
                          value={form.nominal}
                          onChange={handleChange}
                          name="nominal"
                          label="Nominal"
                        />
                        <Button
                          onClick={addTransaction}
                          className="w-full my-4 text-white"
                          label="Add Transaction"
                        />
                      </div>
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

export default Accounts;
