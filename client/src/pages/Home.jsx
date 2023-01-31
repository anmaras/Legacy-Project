import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import ProductsList from '../components/ProductsList';
import UpdateProduct from '../components/UpdateProduct';
import './Home.css';
import Spinner from '../components/Spinner';

const Home = () => {
  const [productList, setProductList] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState('');
  const [productToUpdate, setProductToUpdate] = useState({});
  const [addingNewProduct, setAddingNewProduct] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  //Call getAllProducts function on page render
  useEffect(() => {
    getAllProducts();
  }, []);
  //Request to get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products');
      const sortedArray = data.reverse();
      setProductList(sortedArray);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  //Toggling the addingNewProduct to show and hide the form
  const showForm = () => {
    setAddingNewProduct(!addingNewProduct);
  };
  // Request to add product
  const addProduct = async (e) => {
    e.preventDefault();
    //Checking if values are empty
    if (newProductName.length === 0 || newProductQuantity.length === 0) {
      toast.error('Name and quantity are required');
      return;
    }
    //If values are not empty add the products
    try {
      const { data } = await axios.post('/api/products', {
        name: newProductName,
        quantity: newProductQuantity,
      });
      toast.success('New Product Created!');
      setProductList([{ ...data }, ...productList]);
      setNewProductName('');
      setNewProductQuantity('');
      setAddingNewProduct(false);
    } catch (error) {
      console.log(error);
    }
  };
  //Toggling the showPopUp to show and hide popup
  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };
  // Updating product in the frontend
  const updateProduct = (product) => {
    const newList = [...productList];
    newList.forEach((item) => {
      if (item._id === product._id) {
        item.name = product.name;
        item.quantity = product.quantity;
      }
    });
    toast.success('Product Updated Successfully!');
    setProductList(newList);
  };
  // Updating quantity
  const updateQuantity = async (e, id) => {
    try {
      const product = productList.find((product) => id === product._id);
      //Checking the class to see which button has been clicked
      const newQuantity =
        e.target.className === 'minus'
          ? (Number(product.quantity) - 1).toString()
          : (Number(product.quantity) + 1).toString();
      if (newQuantity < 0) {
        toast.error('Quantity cannot be a negative number!');
        return;
      }
      //Updating the product quantity in the server
      await axios.put(`/api/products/quantity/${id}`, {
        quantity: newQuantity,
      });
      const newList = [...productList];
      //Updating the product in the product list
      newList.forEach((item) => {
        if (item._id === id) {
          item.quantity = newQuantity;
        }
      });
      setProductList(newList);
    } catch (error) {
      console.log(error);
    }
  };

  const removeProduct = async (id) => {
    try {
      //Deleting the product from server side
      await axios.delete(`/api/products/${id}`);
      toast.success('Product Deleted!');
      //Removing the product from the list
      setProductList(productList.filter((product) => product._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Layout>
      <div className="home-container">
        <Navbar />
        <button type="button" className="addProduct" onClick={showForm}>
          Add Product
        </button>
        {addingNewProduct && (
          <form className="product-form" onSubmit={addProduct}>
            <input
              type="text"
              value={newProductName}
              placeholder="Product Name"
              onChange={(e) => setNewProductName(e.target.value)}
            />
            <input
              type="number"
              value={newProductQuantity}
              placeholder="Quantity"
              onChange={(e) => setNewProductQuantity(e.target.value)}
            />
            <button className="product-form-button" type="submit">
              Add
            </button>
          </form>
        )}
        {productList.length ? (
          <ProductsList
            productList={productList}
            removeProduct={removeProduct}
            productToUpdate={(product) => setProductToUpdate(product)}
            updateQuantity={updateQuantity}
            togglePopUp={togglePopUp}
          />
        ) : (
          <h2 className="empty-list">No cookies in the jar</h2>
        )}
      </div>
      {showPopUp && (
        <UpdateProduct
          product={productToUpdate}
          updateProduct={updateProduct}
          togglePopUp={togglePopUp}
        />
      )}
    </Layout>
  );
};

export default Home;
