import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

export const saveTopologyData = async (topologyData, authCtx) => {
  const adminTopologyDoc = doc(db, "admin", "topology");
  const payload = {
    topology: topologyData.map((item, idx) => ({ 
      id: idx + 1, 
      ...item 
    })),
    updatedAt: serverTimestamp(),
    updatedBy: authCtx?.user?.uid || null,
  };
  await setDoc(adminTopologyDoc, payload, { merge: true });
};

export const loadTopologyData = async () => {
  const adminTopologyDoc = doc(db, "admin", "topology");
  const docSnap = await getDoc(adminTopologyDoc);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.topology || [];
  }
  return [];
};

export const parseInput = (input) => {
  const trimmed = input.trim();
  if (!trimmed) return [];

  // Try parsing as JSON first
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map(validateTopologyItem);
    } else {
      throw new Error("Input must be an array of topology items");
    }
  } catch (jsonError) {
    throw new Error(`Invalid JSON format: ${jsonError.message}`);
  }
};

const validateTopologyItem = (item) => {
  if (!item || typeof item !== "object") {
    throw new Error("Each topology item must be an object");
  }
  
  if (!item.intention_type || typeof item.intention_type !== "string") {
    throw new Error("Each topology item must have an 'intention_type' field");
  }
  
  if (!item.intention_list || !Array.isArray(item.intention_list) || item.intention_list.length === 0) {
    throw new Error("Each topology item must have an 'intention_list' array with at least one intention");
  }

  // Validate each intention in the list
  const validatedIntentions = item.intention_list.map((intention, idx) => {
    if (!intention || typeof intention !== "object") {
      throw new Error(`Intention ${idx + 1} in "${item.intention_type}" must be an object`);
    }
    
    if (!intention.short_text || typeof intention.short_text !== "string") {
      throw new Error(`Intention ${idx + 1} in "${item.intention_type}" must have a 'short_text' field`);
    }
    
    if (!intention.long_text || typeof intention.long_text !== "string") {
      throw new Error(`Intention ${idx + 1} in "${item.intention_type}" must have a 'long_text' field`);
    }
    
    return {
      short_text: intention.short_text.trim(),
      long_text: intention.long_text.trim(),
    };
  });
  
  return {
    intention_type: item.intention_type.trim(),
    intention_list: validatedIntentions,
  };
};
