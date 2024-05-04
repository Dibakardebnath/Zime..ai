import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Select, Input, Flex, Table, Tag } from "antd";
import { useSearchParams } from "react-router-dom";

const { Search } = Input;

const Home = () => {
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(150);
  const [skip, setSkip] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState("");

  //URL param

  const [searchParam, setSearchParam] = useSearchParams();

  // GET URL params data

  const query = searchParam.get("page");
  console.log(query);
  const search = searchParam.get("search") || "";

  const tag = searchParam.get("tag");

  const handleChange = (tag) => {
    setSearchParam({ tag: tag, search: search });
    setSelectedTags(tag);
  };

  const handleSearch = (e) => {
    setSearchParam({ tag: selectedTags, search: e.target.value });
    setSearchText(search);
  };

  const options = [
    {
      label: "History",
      value: "history",
      desc: "History",
    },
    {
      label: "American",
      value: "american",
      desc: "American",
    },
    {
      label: "French",
      value: "french",
      desc: "French",
    },
    {
      label: "English",
      value: "english",
      desc: "English",
    },
    {
      label: "Crime",
      value: "crime",
      desc: "Crime",
    },
    {
      label: "Fiction",
      value: "fiction",
      desc: "Fiction",
    },
    {
      label: "Magical",
      value: "magical",
      desc: "Magical",
    },
    {
      label: "Mystery",
      value: "mystery",
      desc: "Mystery",
    },
    {
      label: "Love",
      value: "love",
      desc: "Love",
    },
    {
      label: "Classic",
      value: "classic",
      desc: "Classic",
    },
  ];

  // Fetch data
  useEffect(() => {
    fetchData(limit, skip);
  }, [limit, skip, selectedTags, searchText]);

  const fetchData = async (limit, skip) => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`
      );

      let responseData = response.data.posts;

      // Filter by selected tags
      if (selectedTags.length > 0) {
        responseData = responseData.filter((post) => {
          return selectedTags.every((tag) => post.tags.includes(tag));
        });
      }

      // Filter by search text
      if (searchText) {
        responseData = responseData.filter((post) =>
          post.body.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      setData(responseData);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag, index) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={index}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Reactions",
      dataIndex: "reactions",
      key: "reactions",
    },
  ];

  return (
    <>
      {loader ? (
        <div className="loader">
          <img
            src="https://cdn.pixabay.com/animation/2023/05/02/04/29/04-29-06-428_512.gif"
            alt=""
          />
        </div>
      ) : (
        <div className="main-container">
          <h1> Data Table</h1>

          <Flex className="radio-container">
            <Select
              mode="multiple"
              className="radio-container-select"
              placeholder="Select tags name"
              defaultValue={[]}
              onChange={handleChange}
              options={options}
            />
            <Search
              className="radio-container-search"
              placeholder="Input search text"
              allowClear
              enterButton="Search"
              size="large"
              onChange={handleSearch}
            />
          </Flex>
          <Flex className="table">
            <Table
              columns={columns}
              dataSource={data.map((item, index) => ({ ...item, key: index }))}
            />
          </Flex>
        </div>
      )}
    </>
  );
};

export default Home;
