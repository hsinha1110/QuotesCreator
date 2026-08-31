import {
  getAuth,
  signInWithCredential,
  signOut,
  linkWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from '@react-native-firebase/auth';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';

const auth = getAuth();

// =====================================================
// FACEBOOK PROFILE
// =====================================================

const getFacebookProfile = async () => {
  return new Promise<any>((resolve, reject) => {
    const request = new GraphRequest(
      '/me',
      {
        parameters: {
          fields: {
            string: 'id,name,email,picture.type(large)',
          },
        },
      },
      (error, result) => {
        if (error) {
          console.log('❌ FACEBOOK GRAPH ERROR:', error);
          reject(error);
          return;
        }

        console.log('🔥 FACEBOOK PROFILE:', result);

        resolve(result);
      },
    );

    new GraphRequestManager().addRequest(request).start();
  });
};

// =====================================================
// FACEBOOK CREDENTIAL
// =====================================================

const getFacebookCredential = async () => {
  try {
    console.log('🔥 GETTING FACEBOOK CREDENTIAL');

    // Clear old Facebook session
    try {
      await LoginManager.logOut();
    } catch (error) {
      console.log('⚠️ Previous Facebook logout:', error);
    }

    // Facebook login
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    console.log('🔥 FACEBOOK LOGIN RESULT:', result);

    if (result.isCancelled) {
      const error: any = new Error('Facebook login cancelled');
      error.code = 'SIGN_IN_CANCELLED';
      throw error;
    }

    const accessTokenData = await AccessToken.getCurrentAccessToken();

    if (!accessTokenData?.accessToken) {
      throw new Error('Facebook access token not received');
    }

    const accessToken = accessTokenData.accessToken;

    const credential = FacebookAuthProvider.credential(accessToken);

    // Get Facebook profile
    let profile: any = null;

    try {
      profile = await getFacebookProfile();
    } catch (error) {
      console.log('⚠️ FACEBOOK PROFILE ERROR:', error);
    }

    const email = profile?.email?.trim()?.toLowerCase();

    console.log('🔥 FACEBOOK EMAIL:', email);

    if (!email) {
      throw new Error(
        'Facebook email not available. Please allow email permission.',
      );
    }

    return {
      credential,
      accessToken,
      profile,
      email,
    };
  } catch (error: any) {
    console.log('❌ FACEBOOK CREDENTIAL ERROR:', error?.code, error?.message);

    throw error;
  }
};

// =====================================================
// GOOGLE CREDENTIAL
// =====================================================

const getGoogleCredential = async () => {
  try {
    console.log('🔥 GETTING GOOGLE CREDENTIAL');

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const googleResponse = await GoogleSignin.signIn();

    console.log('🔥 GOOGLE RESPONSE:', googleResponse);

    if (googleResponse.type === 'cancelled') {
      const error: any = new Error('Google login cancelled');

      error.code = 'SIGN_IN_CANCELLED';

      throw error;
    }

    const idToken = googleResponse.data?.idToken;

    if (!idToken) {
      throw new Error('Google ID token not received');
    }

    const credential = GoogleAuthProvider.credential(idToken);

    const email = googleResponse.data?.user?.email?.trim()?.toLowerCase();

    console.log('🔥 GOOGLE EMAIL:', email);

    if (!email) {
      throw new Error('Google email not available');
    }

    return {
      credential,
      googleResponse,
      email,
    };
  } catch (error: any) {
    console.log('❌ GOOGLE CREDENTIAL ERROR:', error?.code, error?.message);

    throw error;
  }
};

// =====================================================
// GOOGLE LOGIN
// =====================================================

export const googleLogin = async () => {
  try {
    console.log('================================');
    console.log('🔥 GOOGLE LOGIN STARTED');
    console.log('================================');

    // -----------------------------------------------
    // 1. Get Google credential
    // -----------------------------------------------

    const { credential: googleCredential, email: googleEmail } =
      await getGoogleCredential();

    console.log('🔥 GOOGLE EMAIL:', googleEmail);

    // -----------------------------------------------
    // 2. Normal Google login
    // -----------------------------------------------

    try {
      const userCredential = await signInWithCredential(auth, googleCredential);

      console.log('✅ GOOGLE FIREBASE LOGIN SUCCESS');

      console.log('🔥 FIREBASE UID:', userCredential.user.uid);

      return userCredential;
    } catch (error: any) {
      console.log('⚠️ GOOGLE LOGIN ERROR:', error?.code, error?.message);

      // Only handle provider conflict
      if (error?.code !== 'auth/account-exists-with-different-credential') {
        throw error;
      }

      console.log('🟡 GOOGLE ACCOUNT CONFLICT');

      console.log('🟢 EXISTING FACEBOOK ACCOUNT WILL BE USED');

      // -----------------------------------------------
      // 3. Login Facebook account
      // -----------------------------------------------

      const { credential: facebookCredential, email: facebookEmail } =
        await getFacebookCredential();

      // -----------------------------------------------
      // 4. Make sure same email
      // -----------------------------------------------

      if (facebookEmail !== googleEmail) {
        throw new Error('Google and Facebook email addresses are different.');
      }

      console.log('✅ GOOGLE + FACEBOOK EMAIL MATCH');

      // -----------------------------------------------
      // 5. Login existing Facebook Firebase user
      // -----------------------------------------------

      const facebookUserCredential = await signInWithCredential(
        auth,
        facebookCredential,
      );

      const firebaseUser = facebookUserCredential.user;

      console.log('✅ EXISTING FACEBOOK USER LOGIN SUCCESS');

      console.log('🔥 EXISTING FIREBASE UID:', firebaseUser.uid);

      // -----------------------------------------------
      // 6. LINK GOOGLE
      // -----------------------------------------------

      try {
        await linkWithCredential(firebaseUser, googleCredential);

        console.log('✅ GOOGLE PROVIDER LINKED');
      } catch (linkError: any) {
        console.log(
          '⚠️ GOOGLE LINK ERROR:',
          linkError?.code,
          linkError?.message,
        );

        if (linkError?.code !== 'auth/provider-already-linked') {
          throw linkError;
        }

        console.log('ℹ️ GOOGLE ALREADY LINKED');
      }

      // -----------------------------------------------
      // IMPORTANT:
      // DO NOT UNLINK FACEBOOK
      // -----------------------------------------------

      console.log('🎉 GOOGLE + FACEBOOK LINKED');

      console.log('🔥 SAME FIREBASE UID:', firebaseUser.uid);

      return facebookUserCredential;
    }
  } catch (error: any) {
    console.log('❌ GOOGLE LOGIN FINAL ERROR:', error?.code, error?.message);

    throw error;
  }
};

// =====================================================
// FACEBOOK LOGIN
// =====================================================

export const facebookLogin = async () => {
  try {
    console.log('================================');
    console.log('🔥 FACEBOOK LOGIN STARTED');
    console.log('================================');

    const { credential: facebookCredential } = await getFacebookCredential();

    // -----------------------------------------------
    // DIRECT FACEBOOK LOGIN ONLY
    // -----------------------------------------------

    const userCredential = await signInWithCredential(auth, facebookCredential);

    console.log('✅ FACEBOOK FIREBASE LOGIN SUCCESS');

    console.log('🔥 FIREBASE UID:', userCredential.user.uid);

    return userCredential;
  } catch (error: any) {
    console.log('❌ FACEBOOK LOGIN ERROR:', error?.code, error?.message);

    throw error;
  }
};

// =====================================================
// LOGOUT
// =====================================================

export const logout = async () => {
  try {
    console.log('================================');
    console.log('🔥 LOGOUT STARTED');
    console.log('================================');

    // Firebase logout
    try {
      await signOut(auth);

      console.log('✅ FIREBASE LOGOUT SUCCESS');
    } catch (error) {
      console.log('⚠️ FIREBASE LOGOUT ERROR:', error);
    }

    // Google SDK logout
    try {
      await GoogleSignin.signOut();

      console.log('✅ GOOGLE LOGOUT SUCCESS');
    } catch (error) {
      console.log('⚠️ GOOGLE LOGOUT:', error);
    }

    // Facebook SDK logout
    try {
      await LoginManager.logOut();

      console.log('✅ FACEBOOK LOGOUT SUCCESS');
    } catch (error) {
      console.log('⚠️ FACEBOOK LOGOUT:', error);
    }

    console.log('🔥 COMPLETE LOGOUT SUCCESS');
  } catch (error: any) {
    console.log('❌ LOGOUT ERROR:', error?.code, error?.message);

    throw error;
  }
};
