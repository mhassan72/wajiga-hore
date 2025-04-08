// Replace the switch statement with a map for easier maintenance
const firebaseErrorMap: Record<string, string> = {
    'auth/invalid-email': 'Cinwaanka email-ka sax ma aha.',
    'auth/user-disabled': 'Akaawntigaaga waa la xannibay. Fadlan la xiriir taageerada.',
    'auth/user-not-found': 'Akaawnkan lama helin.',
    'auth/wrong-password': 'Erayga sirta ah waa khalad.',
    'auth/email-already-in-use': 'Emailkan hore ayaa loo isticmaalay.',
    'auth/weak-password': 'Erayga sirta ah waa daciif. Fadlan isticmaal mid adag.',
    'auth/missing-password': 'Fadlan geli erayga sirta ah.',
    'auth/missing-email': 'Fadlan geli email sax ah.',
    'auth/too-many-requests': 'Waxaad isku dayday inaad si xad dhaaf ah u gasho. Fadlan sug oo mar kale isku day.',
    'auth/network-request-failed': 'Waxaa dhacay cilad shabakad. Fadlan hubi xiriirkaaga internetka.',
  }
  
export const translateFirebaseErrorToSomali = (code: string): string => {
    return firebaseErrorMap[code] || 'Waxaa dhacay khalad aan la garanayn. Fadlan isku day mar kale.'
}
  