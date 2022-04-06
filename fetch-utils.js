const SUPABASE_URL = 'https://afgbmdkvqbvliaergujk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZ2JtZGt2cWJ2bGlhZXJndWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc2Mzg2NTUsImV4cCI6MTk2MzIxNDY1NX0.VyU9_hrFWQ13GXnm_YwMxhGCqRVI1VMlopV5PCqYqYI';

export const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


export function getUser () {
  return client.auth.session() && client.auth.session().user;
}

export function checkAuth () {
  const user = getUser();

  if (!user) location.replace('../');
}

export function redirectIfLoggedIn () {
  if (getUser()) {
    location.replace('./profiles');
  }
}

export async function createProfile () {
  const response = await client
    .from('profiles')
    .insert({})
    .single();


  return response.body;
}

export async function getProfiles (type, trueFalse) {
  const response = await client
    .from('profiles')
    .select('*')
    .order(type, { ascending: trueFalse });

  return response.body;
}



export async function signupUser (email, password) {
  const response = await client.auth.signUp({ email, password });

  if (response.user) {
    await createProfile();
  }

  return response.user;
}

export async function signInUser (email, password) {
  const response = await client.auth.signIn({ email, password });

  return response.user;
}

export async function logout () {
  await client.auth.signOut();

  return (window.location.href = '../');
}

export async function getMyProfile () {
  const user = getUser();

  const response = await client
    .from('profiles')
    .select('*')
    .match({ email: user.email })
    .single();

  return response.body;

}

export async function getProfile (id) {
  const response = await client
    .from('profiles')
    .select('*')
    .match({ id: id })
    .single();

  return response.body;

}

export async function createMessage (message) {
  const response = await client
    .from('messages')
    .insert(message)
    .single();

  return response.body;
}

export async function getMessages (recipientId) {
  const response = await client
    .from('messages')
    .select('*, profiles:sender_id (*)')
    .match({ recipient_id: recipientId });

  return response.body;
}

export async function incrementKarma (profileId) {
  const profile = await getProfile(profileId);

  const response = await client
    .from('profiles')
    .update({ karma: profile.karma + 1 })
    .match({ id: profileId })
    .single();

  return response.body;
}

export async function decrementKarma (profileId) {
  const profile = await getProfile(profileId);

  const response = await client
    .from('profiles')
    .update({ karma: profile.karma - 1 })
    .match({ id: profileId })
    .single();

  return response.body;
}


export async function imageUpload (filePath, imageFile) {
  const response = await client
    .storage
    .from('profile-images')
    .upload(filePath, imageFile, {
      cacheControl: '3600',
      upsert: true
    });

  return response.body;
}

export async function updateProfileImage (id, imageURL) {
  const response = await client
    .from('profiles')
    .update({ avatar: imageURL })
    .match({ id: id })
    .single();

  return response.body;
}




// function checkError({ data, error }) {
//     return error ? console.error(error) : data;
// }
