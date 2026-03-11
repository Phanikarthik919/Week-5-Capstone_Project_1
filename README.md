                        types of roles                            
                        /      |       \
                Author       User     Admin
                    /          |            \
             registration    registration    login
             login           login           read articles
             Add article     read articles   block/unblock user
             view articles   commenting  

### Backend Development

1. Create git repo
    git init

2. Add .gitignore file

3. Create .env file for environment variables
   //and read data from .env with "dotenv" module
   //npm install dotenv

4. Generate package.json
    npm init -y

5. Create express app
    npm install express
    //install mongoose
    npm i mongoose

6. connect to Database

7. Add middlewares( body parser , err handling middleware)

8. Design Schemas and create models

9. design RestAPIs for all resources

10. Registration & Login in common for USER & AUTHOR. Create a seperate service to reuse

11. The Client wont send role. It just redirects to a specific API based on role selection. The hardcoded role assigned by API routes.
