# NivasiSpace Admissions

Build a complete production-ready NivasiSpace Admission Management System.

IMPORTANT:

This is an INTERNAL ADMINISTRATION SYSTEM for NivasiSpace.

The purpose of this application is to:

- Add student/tenant admissions

- Store their profile photo

- Store basic personal information

- Record college and room details

- Assign a package

- Track package amount and payment

- Track whether bag has been provided

- Track whether tiffin has been provided

- Track whether mattress is required

- View all admissions from a dashboard

- Quickly identify pending payments and pending items

- Edit admission information later

DO NOT build this as a marketing website, CRM, lead-generation form, or complicated enrollment system.

The application should be fast and simple for NivasiSpace staff to use.

============================================================

1. DESIGN REFERENCE

============================================================

Use the uploaded NivasiSpace promotional poster as the primary visual reference for the design.

The poster has:

- NivasiSpace branding

- Orange and deep orange theme

- Warm amber/golden accents

- Cream and white cards

- Rounded corners

- Soft shadows

- Premium modern appearance

- Clean typography

- Friendly Indian startup aesthetic

Use the same visual identity throughout this admin application.

IMPORTANT:

Do NOT reproduce the poster as a website.

Instead, create a professional modern SaaS/admin dashboard inspired by the poster.

The application should feel like:

“Premium NivasiSpace Student & Admission Management Software”

not like an advertisement.

============================================================

2. TECHNOLOGY

============================================================

Use:

React

Vite

TypeScript

Tailwind CSS

Backend:

Firebase Firestore

Authentication:

Firebase Authentication

Profile image storage:

Supabase Storage

Do NOT use Supabase as the main database.

Firestore = main application database.

Supabase Storage = profile pictures only.

Use reusable React components.

Keep the code clean, modular and maintainable.

============================================================

3. BRANDING

============================================================

Brand:

NivasiSpace

Tagline:

“One Platform. Limitless Possibilities.”

Website:

www.nivasispace.com

Use the existing NivasiSpace logo asset if available.

IMPORTANT:

Do not recreate, redraw, recolor or modify the NivasiSpace logo.

Use the exact logo provided in the project.

============================================================

4. APPLICATION STRUCTURE

============================================================

Create these routes:

/admin/login

/admin/dashboard

/admin/admissions

/admin/admissions/new

/admin/admissions/:admissionId

/admin/admissions/:admissionId/edit

/admin/packages

/admin/settings

============================================================

5. ADMIN LOGIN

============================================================

Create a clean NivasiSpace admin login page.

Title:

“NivasiSpace Admin”

Subtitle:

“Admission Management System”

Fields:

Email

Password

Button:

“Login”

Show:

Loading state

Invalid login error

Authentication error

Use Firebase Authentication.

Unauthenticated users must not be able to access admin pages.

After successful login:

Redirect to:

/admin/dashboard

Add a logout option in the profile menu.

============================================================

6. MAIN ADMIN LAYOUT

============================================================

Create a responsive admin layout.

Desktop:

Left sidebar

Main content area

Sidebar:

NivasiSpace logo

Dashboard

Admissions

Packages

Settings

At bottom:

Admin profile

Logout

Mobile:

Use a top header with:

NivasiSpace logo

Menu button

Open navigation in a mobile drawer.

The sidebar should remain clean and compact.

============================================================

7. DASHBOARD

============================================================

Route:

/admin/dashboard

Page title:

“Admission Dashboard”

Subtitle:

“Manage students, packages, payments and provided items.”

Top-right button:

“+ New Admission”

============================================================

8. DASHBOARD SUMMARY CARDS

============================================================

Create compact summary cards.

Show these statistics:

TOTAL STUDENTS

Total number of admissions.

NEW ADMISSIONS

Admissions created recently.

PAYMENT COMPLETED

Number of admissions where payment is fully completed.

PAYMENT PENDING

Number of admissions where payment is still pending.

BAGS PENDING

Number of students where bagProvided == false.

TIFFIN PENDING

Number of students where tiffinProvided == false.

MATTRESS REQUIRED

Number of students where mattressRequired == true.

Use clean icons.

Example:

Total Students

128

Payment Completed

92

Payment Pending

36

Bags Pending

18

Tiffin Pending

28

Mattress Required

15

Use a responsive grid.

Desktop:

4 cards per row if space allows.

Tablet:

2 cards per row.

Mobile:

2 cards per row.

============================================================

9. DASHBOARD QUICK ACTIONS

============================================================

Create a section:

“Quick Actions”

Buttons:

+ New Admission

View All Admissions

Payment Pending

Items Pending

Manage Packages

Each button should navigate to the appropriate page/filter.

============================================================

10. PENDING ACTIONS

============================================================

Create a dashboard section:

“Pending Actions”

Display four compact clickable cards:

Payment Pending

36 Students

Bags Pending

18 Students

Tiffin Pending

28 Students

Mattress Required

15 Students

When clicked:

Payment Pending:

Open admissions page filtered by paymentStatus = pending.

Bags Pending:

Open admissions filtered by bagProvided = false.

Tiffin Pending:

Open admissions filtered by tiffinProvided = false.

Mattress Required:

Open admissions filtered by mattressRequired = true.

============================================================

11. PAYMENT OVERVIEW

============================================================

Create a small dashboard card:

“Payment Overview”

Show:

Total Package Value

₹XXXXXXXX

Amount Collected

₹XXXXXXXX

Amount Pending

₹XXXXXXXX

Completed Payments

XX

Pending Payments

XX

Use a simple progress bar.

Calculate dynamically from Firestore.

Do NOT hardcode these values.

============================================================

12. ITEM OVERVIEW

============================================================

Create:

“Items & Services Overview”

Show:

Bags

Provided: XX

Pending: XX

Tiffin

Provided: XX

Pending: XX

Mattress

Required: XX

Not Required: XX

Make each statistic clickable.

============================================================

13. RECENT ADMISSIONS

============================================================

Create a dashboard section:

“Recent Admissions”

Show the latest 10 admissions.

Desktop table columns:

Profile

Student Name

Phone

College

Room

Package

Payment

Bag

Tiffin

Mattress

Admission Date

Action

Example:

Profile | Name | College | Package | Payment | Bag | Tiffin | Mattress

Use compact status badges.

Payment:

✓ Completed

or

⚠ Pending

Bag:

✓ Provided

or

⚠ Pending

Tiffin:

✓ Provided

or

⚠ Pending

Mattress:

Required

or

Not Required

Clicking the student opens their admission profile.

============================================================

14. ADMISSIONS PAGE

============================================================

Route:

/admin/admissions

Page title:

“All Admissions”

Top-right:

“+ New Admission”

Add a search bar:

“Search by name, phone, admission ID…”

Search should support:

Name

Phone

Admission ID

College

Property

============================================================

15. ADMISSION FILTERS

============================================================

Add filters.

Payment:

All

Completed

Pending

Bag:

All

Provided

Pending

Tiffin:

All

Provided

Pending

Mattress:

All

Required

Not Required

Package:

All Packages

College:

All Colleges

Property:

All Properties

Admission date:

All

Today

This Week

This Month

Custom

Allow clearing all filters.

============================================================

16. ADMISSION TABLE

============================================================

Desktop table:

Profile

Admission ID

Name

Phone

College

Property

Room

Package

Payment

Bag

Tiffin

Mattress

Admission Date

Actions

Use compact rows.

Profile photo should be circular.

Use status badges.

Example:

Payment:

✓ Paid

or

⚠ Pending

Bag:

✓ Given

or

⚠ Pending

Tiffin:

✓ Given

or

⚠ Pending

Mattress:

Required

or

Not Required

============================================================

17. MOBILE ADMISSION LIST

============================================================

Do NOT make the table horizontally unusable on mobile.

On mobile convert each admission into a card.

Card:

Profile photo

Name

Admission ID

College

Room

Package

Payment badge

Bag badge

Tiffin badge

Mattress badge

Admission date

“View” button

============================================================

18. NEW ADMISSION PAGE

============================================================

Route:

/admin/admissions/new

Page title:

“New Admission”

Subtitle:

“Add a new student admission.”

Create a clean multi-section form.

Keep the form simple and quick.

============================================================

19. PROFILE PHOTO

============================================================

At the top of the form create:

“Profile Photo”

Show a circular image preview.

Default:

User/profile icon.

Button:

“Upload Photo”

Allow:

JPG

JPEG

PNG

WEBP

Maximum size:

5 MB

Features:

- Preview image

- Replace image

- Remove image

- Upload progress

- Upload error handling

Use Supabase Storage.

Bucket:

profile-pictures

Storage path:

profile-pictures/{generatedAdmissionId}/profile.{extension}

After upload:

Get the public URL.

Store ONLY the URL in Firestore.

Do NOT store image binary/base64 in Firestore.

IMPORTANT:

Never expose the Supabase service-role key in the frontend.

Use only the appropriate public/anon client configuration.

============================================================

20. STUDENT PERSONAL DETAILS

============================================================

Create section:

“Student Details”

Fields:

Full Name *

Phone Number *

Email

Gender

Date of Birth

Full Name and Phone Number are required.

Phone number should support Indian mobile numbers.

Validate:

10-digit Indian mobile number.

Show inline errors.

============================================================

21. COLLEGE DETAILS

============================================================

Create section:

“College Details”

Fields:

College / Institution *

Course

Year

College should be a searchable dropdown.

Initially support:

DYP Engineering College

DYP Medical College

and allow additional colleges later.

Do not hardcode the entire system around only these colleges.

Create a structure that allows colleges to be managed later.

============================================================

22. STAY DETAILS

============================================================

Create section:

“Stay Details”

Fields:

Property / PG

Room Number

Bed Number

Admission Date *

Move-in Date

Property should preferably be loaded from Firestore if a property collection already exists.

If no property collection exists yet, provide a simple dropdown/text field that can later be connected.

============================================================

23. PACKAGE ALLOTMENT

============================================================

Create section:

“Package Allotted”

Use a searchable dropdown.

Packages should be loaded from:

Firestore collection:

packages

Example packages:

Room Only

Room + Mess

Room + Laundry

Room + Ironing

Room + House Cleaning

Complete Package

Custom Package

Do not hardcode package prices in the frontend.

Load active package data from Firestore.

When a package is selected, display:

Package Name

Services Included

Package Price

Duration

============================================================

24. CUSTOM PACKAGE

============================================================

If:

Custom Package

is selected, display:

“Select Included Services”

Checkboxes:

Room

Mess

Laundry

Ironing

House Cleaning

Allow multiple selections.

Show a live summary:

Selected Services:

Room

Mess

Laundry

============================================================

25. PACKAGE DATES

============================================================

Fields:

Package Start Date

Package End Date

Allow admin to enter dates manually.

If the package has a duration, optionally calculate the end date from the start date.

However, allow the admin to manually change the end date.

============================================================

26. PAYMENT DETAILS

============================================================

Create a separate visually highlighted section:

“Payment Details”

Fields:

Total Package Amount ₹ *

Amount Paid ₹ *

Balance Amount ₹

Payment Status

Total Package Amount should come from the selected package by default.

Allow admin to modify the amount if necessary.

Amount Paid is entered by admin.

Automatically calculate:

Balance Amount = Total Package Amount - Amount Paid

Rules:

If Balance Amount <= 0:

Payment Status = Completed

If Balance Amount > 0:

Payment Status = Pending

Display:

✓ Payment Completed

or

⚠ Payment Pending

Make the status visually clear.

============================================================

27. PAYMENT STATUS

============================================================

Payment status values:

completed

pending

Do not use complicated payment states in the first version.

If required later, the system can be expanded.

============================================================

28. BAG TRACKING

============================================================

Create a section:

“Provided Items”

Field:

Bag Provided?

Use a clear toggle.

Options:

Yes

No

Database value:

bagProvided: true / false

Display:

✓ Bag Provided

or

⚠ Bag Pending

Default:

false

============================================================

29. TIFFIN TRACKING

============================================================

Field:

Tiffin Provided?

Options:

Yes

No

Database:

tiffinProvided: true / false

Display:

✓ Tiffin Provided

or

⚠ Tiffin Pending

Default:

false

============================================================

30. MATTRESS TRACKING

============================================================

Field:

Mattress Required?

Options:

Yes

No

Database:

mattressRequired: true / false

Display:

🛏 Mattress Required

or

Not Required

Default:

false

IMPORTANT:

Mattress Required is different from Mattress Provided.

For the first version ONLY track whether the student requires a mattress.

Do not add unnecessary mattress delivery tracking unless needed later.

============================================================

31. NOTES

============================================================

Create:

“Additional Notes”

Optional textarea.

Example:

“Student requested mattress before move-in.”

============================================================

32. SAVE ADMISSION

============================================================

At the bottom:

Cancel

Save Admission

Primary button:

“Save Admission →”

On click:

1. Validate form

2. Generate admission ID

3. Upload profile image if selected

4. Save admission data to Firestore

5. Show success state

Loading:

“Saving Admission…”

Success:

“Admission Saved Successfully ✓”

Then show:

Admission ID:

NS-ADM-XXXXXX

Buttons:

View Student

Add Another Admission

Go to Dashboard

============================================================

33. ADMISSION ID

============================================================

Generate a unique admission ID.

Format:

NS-ADM-000001

or another guaranteed unique format.

Do not use phone number as document ID.

The ID should be unique.

============================================================

34. FIRESTORE DATABASE

============================================================

Use Firebase Firestore.

Main collection:

admissions

Each document should contain:

{

  admissionId,

  profileImageUrl,

  fullName,

  phoneNumber,

  email,

  gender,

  dateOfBirth,

  collegeId,

  collegeName,

  course,

  year,

  propertyId,

  propertyName,

  roomNumber,

  bedNumber,

  admissionDate,

  moveInDate,

  packageId,

  packageName,

  packageServices,

  packageAmount,

  packageStartDate,

  packageEndDate,

  amountPaid,

  balanceAmount,

  paymentStatus,

  bagProvided,

  tiffinProvided,

  mattressRequired,

  notes,

  createdAt,

  updatedAt

}

Use:

serverTimestamp()

for:

createdAt

updatedAt

============================================================

35. PACKAGE DATABASE

============================================================

Create collection:

packages

Structure:

{

  packageId,

  packageName,

  services,

  price,

  duration,

  active,

  createdAt,

  updatedAt

}

Example:

{

  packageName: "Complete Package",

  services: [

    "Room",

    "Mess",

    "Laundry",

    "Ironing",

    "House Cleaning"

  ],

  price: 15000,

  duration: 30,

  active: true

}

Only packages where:

active == true

should appear in the admission form.

============================================================

36. COLLEGE DATABASE

============================================================

Create collection:

colleges

Structure:

{

  collegeId,

  collegeName,

  active,

  createdAt,

  updatedAt

}

Initially add:

DYP Engineering College

DYP Medical College

Allow future colleges to be added.

============================================================

37. PROPERTY DATABASE

============================================================

If a property system already exists in the Firebase project, reuse the existing property collection.

Do NOT create duplicate property data unnecessarily.

If no property system exists, create:

properties

with:

propertyId

propertyName

address

city

active

createdAt

updatedAt

The admission form should be able to select a property.

============================================================

38. STUDENT PROFILE PAGE

============================================================

Route:

/admin/admissions/:admissionId

Create a beautiful student profile page.

Header section:

Large circular profile photo

Student name

Admission ID

College

Payment status

Then show compact cards.

PERSONAL DETAILS

Name

Phone

Email

Gender

Date of Birth

COLLEGE

College

Course

Year

STAY

Property

Room

Bed

Admission Date

Move-in Date

PACKAGE

Package

Services

Amount

Start Date

End Date

PAYMENT

Package Amount

Amount Paid

Balance

Payment Status

PROVIDED ITEMS

Bag

Tiffin

Mattress

NOTES

Notes

============================================================

39. EDIT ADMISSION

============================================================

Route:

/admin/admissions/:admissionId/edit

Allow admin to edit all admission information.

Profile photo can be replaced.

If replacing:

Upload new image to Supabase.

Update profileImageUrl in Firestore.

Do not delete the old image unless safe to do so.

Allow editing:

Personal details

College

Property

Room

Package

Dates

Payment

Bag

Tiffin

Mattress

Notes

Update:

updatedAt

============================================================

40. QUICK ACTIONS

============================================================

From the admissions table allow quick changes.

For example:

Bag:

[⚠ Pending]

Click:

[✓ Provided]

Tiffin:

[⚠ Pending]

Click:

[✓ Provided]

Payment:

[⚠ Pending]

Click opens payment update.

Mattress:

[Required]

Can be toggled.

The admin should not have to open the full profile for simple updates.

============================================================

41. PAYMENT UPDATE

============================================================

Create a small modal:

“Update Payment”

Show:

Package Amount

Amount Paid

Balance

Allow changing:

Amount Paid

Automatically recalculate balance.

If balance = 0:

Completed

If balance > 0:

Pending

Button:

“Save Payment”

============================================================

42. PACKAGES PAGE

============================================================

Route:

/admin/packages

Title:

“Packages”

Button:

“+ Add Package”

Display package cards/table:

Package Name

Services

Price

Duration

Status

Actions

Actions:

Edit

Enable/Disable

Package status:

Active

Inactive

Inactive packages should not appear when creating a new admission.

============================================================

43. PACKAGE CREATION

============================================================

Fields:

Package Name

Price

Duration

Services

Services:

Room

Mess

Laundry

Ironing

House Cleaning

Active:

Yes / No

Save package to Firestore.

============================================================

44. DASHBOARD CALCULATIONS

============================================================

All dashboard values must be calculated dynamically from Firestore.

Examples:

Total Students:

count(admissions)

Payment Completed:

paymentStatus == "completed"

Payment Pending:

paymentStatus == "pending"

Bags Pending:

bagProvided == false

Tiffin Pending:

tiffinProvided == false

Mattress Required:

mattressRequired == true

Total Package Value:

sum(packageAmount)

Total Collected:

sum(amountPaid)

Total Pending:

sum(balanceAmount)

Do not hardcode statistics.

============================================================

45. DASHBOARD DATE FILTER

============================================================

Add a date filter to the dashboard:

Today

This Week

This Month

All Time

For Recent Admissions:

Show the latest admissions according to createdAt.

============================================================

46. EMPTY STATES

============================================================

If there are no admissions:

Show:

“No Admissions Yet”

“Add your first student admission to get started.”

Button:

“+ New Admission”

If there are no pending payments:

Show:

“✓ No Pending Payments”

If no bags are pending:

“✓ All Bags Provided”

If no tiffins are pending:

“✓ All Tiffins Provided”

If no mattresses are required:

“No Mattress Requests”

============================================================

47. LOADING STATES

============================================================

Use skeleton loaders while Firestore data loads.

Do not show blank screens.

Forms should show loading states.

Buttons should be disabled while saving.

Prevent double submissions.

============================================================

48. ERROR HANDLING

============================================================

Show friendly error messages.

Examples:

“Unable to load admissions.”

“Unable to save admission.”

“Profile photo upload failed.”

“Please check your internet connection.”

“Please enter a valid phone number.”

Never expose raw Firebase errors to the user.

Log detailed errors to the console for development.

============================================================

49. RESPONSIVE DESIGN

============================================================

The entire system must work perfectly on:

Desktop

Laptop

Tablet

Mobile

Desktop:

Sidebar + dashboard

Tablet:

Collapsible sidebar

Mobile:

Top navigation + drawer

Admission form:

One column on mobile.

Dashboard cards:

2 columns on mobile.

Tables:

Convert to cards on mobile.

Do NOT create horizontal scrolling wherever avoidable.

============================================================

50. VISUAL DESIGN

============================================================

Use:

Background:

Warm cream / very light orange

Primary:

NivasiSpace orange

Secondary:

Deep orange

Accent:

Golden amber

Cards:

White

Text:

Dark charcoal

Buttons:

Orange gradient

Use:

rounded-xl

rounded-2xl

Soft shadows.

Use clean icons from Lucide React or another suitable icon library.

Use subtle animations.

Do not overuse animations.

The application should feel premium but fast.

============================================================

51. STATUS DESIGN

============================================================

Use clear status badges.

Payment Completed:

✓ Completed

Payment Pending:

⚠ Pending

Bag Provided:

✓ Provided

Bag Pending:

⚠ Pending

Tiffin Provided:

✓ Provided

Tiffin Pending:

⚠ Pending

Mattress Required:

Required

Mattress Not Required:

Not Required

Keep the status badges compact.

============================================================

52. SECURITY

============================================================

Use Firebase Authentication.

Only authorized admin users can access admin pages.

Firestore security rules must prevent unauthorized users from reading or modifying admissions.

Do not expose Firebase Admin SDK credentials.

Do not put service account credentials in frontend code.

Supabase service-role key must NEVER be exposed in frontend code.

Use only the Supabase client configuration appropriate for browser use.

============================================================

53. FIRESTORE SECURITY

============================================================

Create appropriate Firestore rules.

Only authenticated admin users should be able to:

Read admissions

Create admissions

Update admissions

Delete admissions

Read packages

Create packages

Update packages

Delete packages

Read colleges

Manage colleges

Read properties

Do not leave the database open to everyone.

If an existing Firebase authentication/admin-role structure exists in the project, integrate with it instead of replacing it.

============================================================

54. SUPABASE STORAGE

============================================================

Use Supabase Storage bucket:

profile-pictures

Images should be publicly viewable through their public URL.

Store:

profile-pictures/{admissionId}/profile-image

Store the resulting public URL in:

admissions.profileImageUrl

Do not store binary image data in Firestore.

============================================================

55. PERFORMANCE

============================================================

Keep dashboard fast.

Do not download every large profile image unnecessarily.

Use image previews/thumbnails where possible.

Use Firestore queries efficiently.

Use pagination for large admission lists.

Initially load:

20 or 25 admissions

Add:

“Load More”

when needed.

Do not load thousands of records at once.

============================================================

56. SEARCH PERFORMANCE

============================================================

Search should be practical.

For small datasets, client-side filtering is acceptable.

For larger datasets, structure Firestore queries appropriately.

Search fields:

Name

Phone

Admission ID

College

============================================================

57. DATA VALIDATION

============================================================

Required fields:

Full Name

Phone Number

College

Admission Date

Package

Optional:

Email

Gender

Date of Birth

Course

Year

Property

Room

Bed

Move-in Date

Notes

Payment:

Package Amount required.

Amount Paid defaults to:

0

Balance is automatically calculated.

Bag defaults:

false

Tiffin defaults:

false

Mattress Required defaults:

false

============================================================

58. FORM UX

============================================================

The admission form should be divided into clear sections:

1. Profile Photo

2. Student Details

3. College Details

4. Stay Details

5. Package

6. Payment

7. Provided Items

8. Notes

Use clear section headings.

Do not make the form unnecessarily long.

Use two-column fields on desktop.

Use one-column fields on mobile.

============================================================

59. ADMIN DASHBOARD FINAL STRUCTURE

============================================================

The final dashboard should look approximately like:

NIVASI SPACE

────────────────────────────────────────────

Admission Dashboard                         + New Admission

Manage students, packages, payments and items.

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐

│ TOTAL      │ │ PAYMENT    │ │ PAYMENT    │ │ BAGS       │

│ STUDENTS   │ │ COMPLETED  │ │ PENDING    │ │ PENDING    │

│ 128        │ │ 92         │ │ 36         │ │ 18         │

└────────────┘ └────────────┘ └────────────┘ └────────────┘

┌────────────┐ ┌────────────┐

│ TIFFIN     │ │ MATTRESS   │

│ PENDING    │ │ REQUIRED   │

│ 28         │ │ 15         │

└────────────┘ └────────────┘

QUICK ACTIONS

[ + New Admission ]

[ Payment Pending ]

[ Items Pending ]

[ All Admissions ]

PENDING ACTIONS

⚠ Payment Pending ........ 36

🎒 Bags Pending .......... 18

🍱 Tiffin Pending ........ 28

🛏 Mattress Required ..... 15

PAYMENT OVERVIEW

Total Package Value       ₹1,920,000

Amount Collected          ₹1,600,000

Amount Pending            ₹320,000

RECENT ADMISSIONS

Profile | Name | College | Package | Payment | Bag | Tiffin | Mattress

-----------------------------------------------------------------------

Photo   | Rahul| DYP      | Complete| ✓ Paid  | ✓   | ✓      | Required

Photo   | Amit | DYP      | Room+Mess| ⚠ Pend | ✓   | ⚠      | No

Photo   | Sneha| DYP      | Room Only| ✓ Paid | ⚠   | ✓      | No

============================================================

60. MOST IMPORTANT REQUIREMENT

============================================================

Keep the application SIMPLE.

The staff should be able to add an admission in approximately 1–2 minutes.

The most important information is:

PROFILE PHOTO

NAME

PHONE

COLLEGE

ROOM

PACKAGE ALLOTTED

PACKAGE AMOUNT

PAYMENT STATUS

BAG PROVIDED

TIFFIN PROVIDED

MATTRESS REQUIRED

Everything else should be secondary.

============================================================

61. DO NOT ADD UNNECESSARY FEATURES

============================================================

Do NOT add:

Lead generation

Marketing forms

Referral system

Follow-up CRM

Complex customer segmentation

Social media

Public student profiles

Student registration/login

Chat

Notifications

Complicated analytics

Unnecessary surveys

Focus entirely on:

ADMISSION MANAGEMENT

============================================================

62. FINAL WORKFLOW

============================================================

ADMIN LOGIN

↓

DASHBOARD

↓

Click:

“+ New Admission”

↓

Upload Profile Photo

↓

Enter:

Name

Phone

Email

↓

Select:

College

↓

Enter:

Property

Room

Bed

↓

Select:

Package

↓

Enter:

Package Amount

Amount Paid

↓

System automatically calculates:

Balance

Payment Status

↓

Select:

Bag Provided?

Yes / No

↓

Select:

Tiffin Provided?

Yes / No

↓

Select:

Mattress Required?

Yes / No

↓

Add Notes

↓

Save Admission

↓

Generate:

NS-ADM-XXXXXX

↓

Student appears in:

Dashboard

and

Admissions List

↓

Admin can later:

Edit Student

Update Payment

Mark Bag Provided

Mark Tiffin Provided

Update Mattress Requirement

Change Package

============================================================

63. FINAL QUALITY REQUIREMENT

============================================================

Build this as a polished, production-ready application.

Do not leave placeholder functionality.

All buttons should work.

All forms should save to Firestore.

Profile photos should upload to Supabase Storage.

Dashboard numbers should update dynamically.

Admission list should update dynamically.

Payment balance should calculate automatically.

Filters should work.

Search should work.

Edit should work.

Package management should work.

Authentication should work.

Responsive design should work.

Use the NivasiSpace orange/amber/cream visual identity from the uploaded poster throughout the application.

The final result should look like a real internal NivasiSpace product that staff can use every day.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8c268477-e1ed-4a35-a8f7-93d2e606d747).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
