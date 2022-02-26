# iLocale

iLocale is a web application that allows users to discover businesses (such as restaurants, hotels, and fitness centers) at any location worldwide. iLocale also provides User reviews and information about a specific businesses.

This application is developed with: **MongoDB, Express.js, Node.js, Embedded Javascript(EJS), HTML, CSS, Bootstrap 4, and Vanilla Javascript**

Site URL: https://ilocale.herokuapp.com/

## Features 
- Google O Auth Integration with Passport.js
- Basic Authentication with Passport.js
- Email Sending with Send Grid API (Single Sender Verified). 
- Geocode locations with Mapbox api.
- Cluster Geocoded locations with Mapbox Api.
- Upload Images and Store in Cloudinary.
- Authorization (Superuser role, Admin role, and Regular user role).
- Paginate with Fetch API.

## Functions
- Authenticate users with Google or by signing in with their created account.
- **Authorization and User management.** Superusers can change the role of a specific user to admin and manage other users posts. 
- **Authorization.** Superuser and admins can create, edit, and delete categories.
- Authenticated users can add, edit, and delete businesses.
- Authenticated users can comment on different users post.
- **Authorization.** Only users who created the post and review, can modify or delete them.
- View clustered businesses through mapbox.
- Image Upload **(Maximum of 5 Images)**. After posting a new business to the app, images will be uploaded to cloudinary.
- Geocode locations. Pin locations on maps after posting a new business. 
- Send emails through contact form.
- Paginate businesses, reviews, categories, and users with Fetch Api.
- Search businesses through their name or location.
- Sort businesses by most reviews, most recent, or oldest.

## iLocale User Interface Gallery

**Home**
![image](https://user-images.githubusercontent.com/97419269/155847582-5a338e8d-15c7-41d0-b4e4-132226b994af.png)


**Businesses Index Page**
![image](https://user-images.githubusercontent.com/97419269/155847650-96b0e3af-8045-4fbd-a0ab-55c78fd30dae.png)


**Business Show Page**
<br>
<br>
One image sample
![image](https://user-images.githubusercontent.com/97419269/155847755-473df521-3c34-4fbf-aa53-2c24ec61705d.png)

Multiple images sample
![image](https://user-images.githubusercontent.com/97419269/155848117-c9c30218-7428-489f-8446-bd9fc08924f4.png)



**Reviews Section(Authenticated user view)**
![image](https://user-images.githubusercontent.com/97419269/155848894-3e068887-9670-4887-9f09-c73916a977c5.png)

**Contact Form**
![image](https://user-images.githubusercontent.com/97419269/155847946-d68ae53d-47cd-4e0c-b0df-a209e156477e.png)


**Add Business Form**
![image](https://user-images.githubusercontent.com/97419269/155848977-d37d3b2a-32d4-4310-8bcd-1059875ba08d.png)


**Edit Business Form**
![image](https://user-images.githubusercontent.com/97419269/155848071-c9e33927-6e9d-4aa9-b897-cc4509b8f024.png)

**Search**
![image](https://user-images.githubusercontent.com/97419269/155848348-da82ca21-7941-486e-8eb3-1ae1e05a5f05.png)

**Pagination**
![image](https://user-images.githubusercontent.com/97419269/155848863-de79e596-854b-4394-bda3-57147d308658.png)

**Admin Panel**
<br>
<br>
Admin Category Index
![image](https://user-images.githubusercontent.com/97419269/155848509-d01def13-3809-4bbd-b834-836acea1f0c1.png)

Admin Category Create
![image](https://user-images.githubusercontent.com/97419269/155848556-afb161bd-4a35-4855-8379-27c58e95df7b.png)




