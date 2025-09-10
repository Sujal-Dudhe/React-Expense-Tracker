import React, { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import moment from 'moment'
import { nanoid } from 'nanoid'
import { Modal, Form, Input, InputNumber, DatePicker, Button } from 'antd'
import { useExpense } from './zustand/useExpense'

const App = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { expenses, setExpense, deleteExpense, updateExpense } = useExpense();
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState(''); // 🔍 search state

  const createExpense = (values) => {
    values.id = nanoid();
    values.date = moment(values.date).toDate();
    setExpense(values);
    handleClose();
  }

  const saveExpense = (values) => {
    values.date = moment(values.date).toDate();
    updateExpense(editId, values);
    handleClose();
  }

  const handleClose = () => {
    setEditId(null);
    setOpen(false);
    form.resetFields();
  }

  const edit = (item) => {
    setEditId(item.id);
    item.date = moment(item.date);
    setOpen(true);
    form.setFieldsValue(item);
  }

  //  Filtered expenses based on search
  const filteredExpenses = expenses.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='bg-slate-900 min-h-screen py-12'>
      <div className='w-9/12 mx-auto bg-white rounded-xl'>
        <div className='p-6 flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold'>Expense Tracker</h1>
            <button
              onClick={() => setOpen(true)}
              className='flex items-center bg-indigo-600 text-white rounded px-8 py-2 font-medium hover:scale-105 transition-transform duration-300'
            >
              <Plus className='w-4 h-4 mr-1' />
              Add new
            </button>
          </div>

          {/* Search Input */}
          <input
            placeholder='Search these expenses'
            className='p-3 rounded border border-gray-300'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <table className='w-full'>
            <thead>
              <tr className='bg-indigo-600 text-white text-left'>
                <th className='py-2.5 pl-4'>Title</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((item) => (
                <tr key={item.id} className='border-b border-b-gray-200'>
                  <td className='py-3 pl-4'>{item.title}</td>
                  <td>{item.description}</td>
                  <td>₹{item.amount}</td>
                  <td>{moment(item.date).format("DD MMM YYYY, hh:mm A")}</td>
                  <td>
                    <div className='flex gap-3'>
                      <button
                        onClick={() => edit(item)}
                        className='w-8 h-8 bg-green-400 text-white flex items-center justify-center rounded'
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => deleteExpense(item.id)}
                        className='w-8 h-8 bg-rose-400 text-white flex items-center justify-center rounded'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='flex items-center justify-end'>
            <h1 className='text-3xl font-bold'>
              Total Expenses - ₹
              {expenses
                .reduce((sum, item) => sum + item.amount, 0)
                .toLocaleString()}
            </h1>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <Modal open={open} footer={null} onCancel={handleClose}>
        <Form
          layout='vertical'
          onFinish={editId ? saveExpense : createExpense}
          form={form}
        >
          <Form.Item
            label='Expense title'
            name='title'
            rules={[{ required: true }]}
          >
            <Input size='large' placeholder='Expense name here' />
          </Form.Item>

          <Form.Item
            label='Expense Description'
            name='description'
            rules={[{ required: true }]}
          >
            <Input.TextArea
              size='large'
              placeholder='Description goes here...'
              rows={4}
            />
          </Form.Item>

          <Form.Item
            label='Amount'
            name='amount'
            rules={[{ required: true }]}
            className='!w-full'
          >
            <InputNumber
              size='large'
              placeholder='Amount'
              className='!w-full'
            />
          </Form.Item>

          <Form.Item
            label='Date'
            name='date'
            rules={[{ required: true }]}
          >
            <DatePicker
              size='large'
              placeholder='Choose expense date'
              className='!w-full'
            />
          </Form.Item>

          <Form.Item>
            {editId ? (
              <Button size='large' type='primary' htmlType='submit' danger>
                Save
              </Button>
            ) : (
              <Button size='large' type='primary' htmlType='submit'>
                Submit
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default App
