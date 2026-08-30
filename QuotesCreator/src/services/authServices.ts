import {
  getAuth,
  signInWithCredential,
  signOut,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  unlink,
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
// GET FACEBOOK PROFILE
// =====================================================

const getFacebookProfile = async () => {
  return new Promise<{
    id: string;
    name?: string;
    email?: string;
    picture?: {
      data?: {
        url?: string;
      };
    };
  } | null>((resolve, reject) => {
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

        console.log('🔥 FACEBOOK GRAPH PROFILE:', result);

        resolve(
          result as {
            id: string;
            name?: string;
            email?: string;
            picture?: {
              data?: {
                url?: string;
              };
            };
          },
        );
      },
    );

    new GraphRequestManager().addRequest(request).start();
  });
};

// =====================================================
// GET FACEBOOK CREDENTIAL
// =====================================================

const getFacebookCredential = async () => {
  try {
    console.log('🔥 GETTING FACEBOOK CREDENTIAL');

    // Previous Facebook SDK session logout
    try {
      await LoginManager.logOut();
    } catch (error) {
      console.log('Previous Facebook logout:', error);
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

    const credential = FacebookAuthProvider.credential(
      accessTokenData.accessToken,
    );

    console.log('✅ FACEBOOK CREDENTIAL CREATED');

    return {
      credential,
      accessToken: accessTokenData.accessToken,
    };
  } catch (error: any) {
    console.log('❌ FACEBOOK CREDENTIAL ERROR:', error?.code, error?.message);

    throw error;
  }
};

// =====================================================
// GET GOOGLE CREDENTIAL
// =====================================================

const getGoogleCredential = async () => {
  try {
    console.log('🔥 GETTING GOOGLE CREDENTIAL');

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const googleResponse = await GoogleSignin.signIn();

    console.log('🔥 GOOGLE RESPONSE:', googleResponse);

    // -------------------------------------------------
    // CANCELLED
    // -------------------------------------------------

    if (googleResponse.type === 'cancelled') {
      const error: any = new Error('Google login cancelled');

      error.code = 'SIGN_IN_CANCELLED';

      throw error;
    }

    // -------------------------------------------------
    // TOKEN
    // -------------------------------------------------

    const idToken = googleResponse.data?.idToken;

    if (!idToken) {
      throw new Error('Google ID token not received');
    }

    const credential = GoogleAuthProvider.credential(idToken);

    console.log('✅ GOOGLE CREDENTIAL CREATED');

    return {
      credential,
      googleResponse,
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

    // =================================================
    // GOOGLE CREDENTIAL
    // =================================================

    const { credential: googleCredential, googleResponse } =
      await getGoogleCredential();

    const googleEmail = googleResponse.data?.user?.email?.trim().toLowerCase();

    console.log('🔥 GOOGLE EMAIL:', googleEmail);

    if (!googleEmail) {
      throw new Error('Google email not available');
    }

    // =================================================
    // CHECK EXISTING FIREBASE PROVIDERS
    // =================================================

    let methods: string[] = [];

    try {
      methods = await fetchSignInMethodsForEmail(auth, googleEmail);
    } catch (error) {
      console.log('⚠️ PROVIDER CHECK ERROR:', error);
    }

    console.log('🔥 EXISTING FIREBASE PROVIDERS:', methods);

    // =================================================
    // FACEBOOK ACCOUNT ALREADY EXISTS
    // =================================================

    if (methods.includes('facebook.com')) {
      console.log('🔵 FACEBOOK PROVIDER FOUND');

      // -----------------------------------------------
      // Get Facebook credential
      // -----------------------------------------------

      const { credential: facebookCredential } = await getFacebookCredential();

      // -----------------------------------------------
      // Login existing Facebook Firebase account
      // -----------------------------------------------

      const facebookUserCredential = await signInWithCredential(
        auth,
        facebookCredential,
      );

      console.log('✅ EXISTING FACEBOOK FIREBASE USER LOGIN SUCCESS');

      const firebaseUser = facebookUserCredential.user;

      // -----------------------------------------------
      // IMPORTANT
      // Link Google FIRST
      // -----------------------------------------------

      await linkWithCredential(firebaseUser, googleCredential);

      console.log('✅ GOOGLE PROVIDER LINKED');

      // -----------------------------------------------
      // Now unlink Facebook
      // -----------------------------------------------

      try {
        await unlink(firebaseUser, 'facebook.com');

        console.log('✅ FACEBOOK PROVIDER UNLINKED');
      } catch (error: any) {
        console.log('⚠️ FACEBOOK UNLINK ERROR:', error?.code, error?.message);
      }

      console.log('✅ GOOGLE LOGIN COMPLETED USING EXISTING ACCOUNT');

      return facebookUserCredential;
    }

    // =================================================
    // NORMAL GOOGLE LOGIN
    // =================================================

    const userCredential = await signInWithCredential(auth, googleCredential);

    console.log('✅ GOOGLE FIREBASE LOGIN SUCCESS');

    return userCredential;
  } catch (error: any) {
    console.log('❌ GOOGLE LOGIN ERROR:', error?.code, error?.message);

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

    // =================================================
    // FACEBOOK CREDENTIAL
    // =================================================

    const { credential: facebookCredential, accessToken } =
      await getFacebookCredential();

    // =================================================
    // GET FACEBOOK EMAIL
    // =================================================

    let facebookEmail: string | null = null;

    try {
      const profile = await getFacebookProfile();

      facebookEmail = profile?.email?.trim().toLowerCase() ?? null;

      console.log('🔥 FACEBOOK EMAIL:', facebookEmail);
    } catch (error) {
      console.log('⚠️ FACEBOOK PROFILE ERROR:', error);
    }

    // =================================================
    // IF EMAIL NOT AVAILABLE
    // =================================================

    if (!facebookEmail) {
      throw new Error(
        'Facebook account email not available. Please make sure Facebook email permission is enabled.',
      );
    }

    // =================================================
    // CHECK EXISTING FIREBASE PROVIDERS
    // =================================================

    let methods: string[] = [];

    try {
      methods = await fetchSignInMethodsForEmail(auth, facebookEmail);
    } catch (error) {
      console.log('⚠️ PROVIDER CHECK ERROR:', error);
    }

    console.log('🔥 EXISTING FIREBASE PROVIDERS:', methods);

    // =================================================
    // GOOGLE ACCOUNT ALREADY EXISTS
    // =================================================

    if (methods.includes('google.com')) {
      console.log('🔴 GOOGLE PROVIDER FOUND');

      // -----------------------------------------------
      // Get Google credential
      // -----------------------------------------------

      const { credential: googleCredential } = await getGoogleCredential();

      // -----------------------------------------------
      // Login existing Google Firebase account
      // -----------------------------------------------

      const googleUserCredential = await signInWithCredential(
        auth,
        googleCredential,
      );

      console.log('✅ EXISTING GOOGLE FIREBASE USER LOGIN SUCCESS');

      const firebaseUser = googleUserCredential.user;

      // -----------------------------------------------
      // IMPORTANT
      // Link Facebook FIRST
      // -----------------------------------------------

      await linkWithCredential(firebaseUser, facebookCredential);

      console.log('✅ FACEBOOK PROVIDER LINKED');

      // -----------------------------------------------
      // Now unlink Google
      // -----------------------------------------------

      try {
        await unlink(firebaseUser, 'google.com');

        console.log('✅ GOOGLE PROVIDER UNLINKED');
      } catch (error: any) {
        console.log('⚠️ GOOGLE UNLINK ERROR:', error?.code, error?.message);
      }

      console.log('✅ FACEBOOK LOGIN COMPLETED USING EXISTING ACCOUNT');

      return googleUserCredential;
    }

    // =================================================
    // NORMAL FACEBOOK LOGIN
    // =================================================

    const userCredential = await signInWithCredential(auth, facebookCredential);

    console.log('✅ FACEBOOK FIREBASE LOGIN SUCCESS');

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

    // Firebase
    try {
      await signOut(auth);

      console.log('✅ FIREBASE LOGOUT SUCCESS');
    } catch (error) {
      console.log('Firebase logout error:', error);
    }

    // Google SDK
    try {
      await GoogleSignin.signOut();

      console.log('✅ GOOGLE LOGOUT SUCCESS');
    } catch (error) {
      console.log('Google logout:', error);
    }

    // Facebook SDK
    try {
      await LoginManager.logOut();

      console.log('✅ FACEBOOK LOGOUT SUCCESS');
    } catch (error) {
      console.log('Facebook logout:', error);
    }

    console.log('🔥 COMPLETE LOGOUT SUCCESS');
  } catch (error: any) {
    console.log('❌ LOGOUT ERROR:', error?.code, error?.message);

    throw error;
  }
};
