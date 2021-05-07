# SocialNetwork

Assignment from 30Hills for Internship, Developer Test.

Angular app - version 11.1.2.

## Task

Input is dataset 'assets/data.json' representing people, in the form of a social graph.

Taks is to write functions that returns:

1. User's direct friends - users that are directly connected to user.
2. User's friends of friends - direct user friends are excluded from this group.
3. User's suggested friends - same as friends of friends but must contain 2+ mutual friends.

## Solution

I used maps and sets to solve this task.

Main logic is placed in '/src/app/user/user.service.ts' file.

### Bugs

Small bug in 'data.json' file.

File 'data_fixed.json' is fixed version.

Further details in 'assets/fix_notes.txt'.
