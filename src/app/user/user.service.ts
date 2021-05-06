import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // store users in Map object (key: user.id; value: User object)
  private users: Map<number, User> = new Map();

  // emmit users as Array of User objects
  users$ = new BehaviorSubject<User[]>([]);

  // selected user and option to show
  selectedOptions$ = new Subject<{ userId: number, option: string }>();
  clearOptions$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  /**
   * LOAD USERS FROM FILE
   */
  fetchUsers(): void {

    // using fixed version of data.json file
    const path = 'assets/data.json'
    const pathFixed = 'assets/data_fixed.json';
    // fetch users from data.json
    this.http.get<Array<{ 
      id: number, 
      firstName: string, 
      surname: string, 
      age: number, 
      gender:string, 
      friends: number[] 
    }>>(pathFixed).pipe(

      // generate Array of User objects
      map(data => 
        data.map(user => new User(user.id, user.firstName, user.surname, user.age, user.gender, new Set(user.friends)))
      ),

      // set users and emmit as Array
      tap(users => {
        this.setUsers(users);
        this.users$.next(Array.from(this.users.values()));
      }),
    ).subscribe();
  }

  /**
   * USER'S FRIENDS
   */
  getUserFriends(userId: number): User[] {
    const user = this.users.get(userId);
    if (!user) return [];

    // init emtpy Array object
    const friends = new Array<User>();

    // itterate user's friends and add them to friends Array
    user.friends.forEach(id => {
      const friend = this.users.get(id);
      if (friend) friends.push(friend);
    });
    return friends;
  }

  /**
   * FRIENDS OF FRIENDS
   */
  getFriendsOfFriends(userId: number): User[] {
    const user = this.users.get(userId);
    if (!user) return [];

    // init empty Map object
    const friendsOfFriends = new Map<number, User>();

    // itterate friends of every user's friend
    user.friends.forEach(friendId => {
      const friend = this.users.get(friendId);
      if (friend) {
        friend.friends.forEach(id => {
          const friendOfFriend = this.users.get(id);         
          if (
            friendOfFriend && 
            // check if friend of friend is not user itself
            friendOfFriend.id !== user.id && 
            // check if friend of friend is not already user's friend
            !user.friends.has(friendOfFriend.id) &&
            // check if friend of friend is not already added to list
            !friendsOfFriends.has(friendOfFriend.id)) 
          {
            friendsOfFriends.set(friendOfFriend.id, friendOfFriend);
          }
        })
      }
    })
    // return Array, not Map
    return Array.from(friendsOfFriends.values());
  }

  /**
   * SUGGESTED FRIENDS
   */
  getSuggestedFriends(userId: number): { user: User, mutualFriends: Set<number>} [] {
    const user = this.users.get(userId);
    if (!user) return [];

    // init Map with key: user.id AND value containig user and Set of mutual friends ids
    const suggestedFriends = new Map<number, { user: User, mutualFriends: Set<number> }>();

    // itterate friends of every user's friend
    user.friends.forEach(friendId => {
      const friend = this.users.get(friendId);
      if (friend) {
        friend.friends.forEach(id => {
          const friendOfFriend = this.users.get(id);
          if (
            friendOfFriend && 
            // check if friend of friend is not user itself
            friendOfFriend.id !== user.id && 
            // check if friend of friend is not already user's friend
            !user.friends.has(friendOfFriend.id)) 
          {
            const suggestedFriend = suggestedFriends.get(friendOfFriend.id);

            // if suggested friend is added to list then add direct friend to Set of mutual friends
            if (suggestedFriend) {
              suggestedFriend.mutualFriends.add(friend.id);

            // if not, then add it to list and add direct friend to Set of mutual friends
            } else {
              suggestedFriends.set(
                friendOfFriend.id, 
                { user: friendOfFriend, mutualFriends: new Set<number>().add(friend.id) })
            }
          }
        })
      }
    })
    // filter Array so it contains only friends of friends with 2 or more mutual friends
    return Array.from(suggestedFriends.values()).filter((value) => value.mutualFriends.size >= 2);

  }

  /**
   * UPDATE USERS
   */
  private setUsers(users: User[]): void {
    const usersMap = new Map<number, User>()
    users.forEach(user => {
      usersMap.set(user.id, user);
    });
    this.users = usersMap;
  }
}
