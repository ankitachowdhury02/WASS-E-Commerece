import React from "react";
import "./Blog2.css";

import {
  Search,
  UserRound,
  CalendarDays,
  Tag,
} from "lucide-react";

import image1 from "../../assets/Laptop.png";
import image2 from "../../assets/Decorate room.png";
import image3 from "../../assets/breakfast.png";

const Blog2 = () => {
  const posts = [
    {
      image: image1,
      title: "Going all-in with millennial design",
      category: "Wood",
    },
    {
      image: image2,
      title: "Exploring new ways of decorating",
      category: "Handmade",
    },
    {
      image: image3,
      title: "Handmade pieces that took time to make",
      category: "Wood",
    },
  ];

  const recentPosts = [
    {
      image: image1,
      title: "Going all-in with millennial design",
      date: "03 Aug 2022",
    },
    {
      image: image2,
      title: "Exploring new ways of decorating",
      date: "03 Aug 2022",
    },
    {
      image: image3,
      title: "Handmade pieces that took time to make",
      date: "03 Aug 2022",
    },
    {
      image: image1,
      title: "Modern home in Milan",
      date: "03 Aug 2022",
    },
    {
      image: image2,
      title: "Colorful office redesign",
      date: "03 Aug 2022",
    },
  ];

  return (
    <section className="blog-section">

      <div className="blog-container">

        {/* ================= LEFT SIDE ================= */}
        <div className="blog-posts">

          {posts.map((post, index) => (
            <article className="blog-post" key={index}>

              <div className="blog-post-image">
                <img
                  src={post.image}
                  alt={post.title}
                />
              </div>

              {/* Post Meta */}
              <div className="blog-meta">

                <span>
                  <UserRound size={13} />
                  Admin
                </span>

                <span>
                  <CalendarDays size={13} />
                  14 Oct 2022
                </span>

                <span>
                  <Tag size={13} />
                  {post.category}
                </span>

              </div>

              {/* Title */}
              <h2>{post.title}</h2>

              {/* Description */}
              <p className="blog-description">
                Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
                Mus mauris vitae ultricies leo integer
                malesuada nunc. In nulla posuere
                sollicitudin aliquam ultrices.
              </p>

              {/* Read More */}
              <button className="read-more">
                Read more
              </button>

            </article>
          ))}

          {/* ================= PAGINATION ================= */}

          <div className="blog-pagination">

            <button className="pagination-active">
              1
            </button>

            <button>
              2
            </button>

            <button>
              3
            </button>

            <button className="pagination-next">
              Next
            </button>

          </div>

        </div>


        {/* ================= RIGHT SIDEBAR ================= */}

        <aside className="blog-sidebar">

          {/* Search */}

          <div className="blog-search">

            <input
              type="text"
              placeholder=""
            />

            <Search size={20} />

          </div>


          {/* Categories */}

          <div className="sidebar-block">

            <h3>Categories</h3>

            <ul className="category-list">

              <li>
                <span>Crafts</span>
                <span>2</span>
              </li>

              <li>
                <span>Design</span>
                <span>8</span>
              </li>

              <li>
                <span>Handmade</span>
                <span>7</span>
              </li>

              <li>
                <span>Interior</span>
                <span>1</span>
              </li>

              <li>
                <span>Wood</span>
                <span>6</span>
              </li>

            </ul>

          </div>


          {/* Recent Posts */}

          <div className="sidebar-block recent-posts">

            <h3>Recent Posts</h3>

            <div className="recent-post-list">

              {recentPosts.map((post, index) => (

                <div
                  className="recent-post"
                  key={index}
                >

                  <img
                    src={post.image}
                    alt={post.title}
                  />

                  <div className="recent-post-info">

                    <h4>{post.title}</h4>

                    <span>{post.date}</span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </aside>

      </div>

    </section>
  );
};

export default Blog2;