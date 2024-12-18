import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../FirebaseConfig';

type UserStatus = {
  success: boolean;
  isNewUser: boolean;
};
// This function is important because it ensures that the user gets added in the database when they sign up
export const ensureUserInDatabase = async (user: User): Promise<UserStatus> => {
  // Check if user exists in database
    try {
    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);

    // If user does not exist, add user to database with essential details
    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        points: 0,
        co2Saved: 0,
        createdAt: new Date().toISOString()
      });
      return { success: true, isNewUser: true };
    }
    return { success: true, isNewUser: false };
    // error handling
  } catch (error) {
    console.error('Error ensuring user in database:', error);
    return { success: false, isNewUser: false };
  }
};