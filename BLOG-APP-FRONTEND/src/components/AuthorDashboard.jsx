import React from 'react';
import { Link } from 'react-router-dom';
import {
  pageBackground, pageWrapper, pageTitleClass, bodyText, mutedText,
  cardClass, headingClass, primaryBtn, secondaryBtn, ghostBtn,
  articleCardClass, articleTitle, articleMeta, articleGrid, divider
} from '../styles/common';

const AuthorDashboard = () => {

  const { currentUser, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  
    // Fetch articles on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:4000/user-api/articles", { withCredentials: true });
        setArticles(res.data.payload);
      } catch (err) {
        console.log("Error fetching articles:", err);
      }
    };

    if (currentUser) {
      fetchArticles();
    }
  }, [currentUser]);

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <p>
          
        </p>
      </div>
    </div>
  );
};

export default AuthorDashboard;
