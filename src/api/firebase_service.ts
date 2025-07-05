import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  startAfter,
  endAt,
  where,
  onSnapshot,
  Timestamp,
  DocumentSnapshot,
  WhereFilterOp,
  limitToLast,
  FieldValue,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage, auth } from "@/firebase";
import { FirebaseError } from "firebase/app";

interface Schema {
  [key: string]: string | Schema | Schema[];
}

const schemas: { [key: string]: Schema } = {
  products: {
    name: "string",
    price: "float",
    stock: "int",
    image: "string",
    description: "string",
    createdAt: "timestamp",
  },
  orders: {
    userId: "string",
    items: [{ productId: "string", quantity: "int" }],
    total: "float",
    status: "string",
    createdAt: "timestamp",
  },
};

export const typeCast = (type: string) => (value: unknown) => {
  if (type === "int") {
    if (!value) return null;
    const numberValue = parseInt(String(value));
    if (isNaN(numberValue)) return null;
    return numberValue;
  }
  if (type === "float") {
    if (!value) return null;
    const numberValue = parseFloat(String(value));
    if (isNaN(numberValue)) return null;
    return numberValue;
  }

  if (type === "timestamp" && value instanceof Timestamp) {
    return value;
  }
  return value;
};

export const typeCastObject =
  <T extends Record<string, unknown>>(modelSchema: Schema) =>
  (model: Record<string, unknown>) => {
    if (!modelSchema) return model as T;
    const modelSchemaKeys = Object.keys(modelSchema);
    for (let i = 0; i < modelSchemaKeys.length; i++) {
      const modelSchemaKey = modelSchemaKeys[i];
      const modelSchemaValue = modelSchema[modelSchemaKey];
      if (!modelSchemaValue || model[modelSchemaKey] === undefined) continue;
      if (typeof modelSchemaValue === "string") {
        model[modelSchemaKey] = typeCast(modelSchemaValue)(
          model[modelSchemaKey]
        );
      } else if (Array.isArray(modelSchemaValue)) {
        const arraySchema = modelSchemaValue[0];
        if (!arraySchema) continue;
        if (typeof arraySchema === "string") {
          model[modelSchemaKey] = (model[modelSchemaKey] as unknown[]).map(
            (x: unknown) => typeCast(arraySchema)(x)
          );
        } else if (typeof arraySchema === "object") {
          model[modelSchemaKey] = (
            model[modelSchemaKey] as Record<string, unknown>[]
          ).map((x: Record<string, unknown>) => typeCastObject(arraySchema)(x));
        }
      } else if (typeof modelSchemaValue === "object") {
        model[modelSchemaKey] = typeCastObject(modelSchemaValue)(
          model[modelSchemaKey] as Record<string, unknown>
        );
      }
    }
    return model as T;
  };

type FirestoreUpdateData = {
  [x: string]: FieldValue | Partial<unknown> | undefined;
};

export class FirebaseActions<T extends Record<string, unknown>> {
  constructor(private collectionPath: string) {
    this.modelSchema = schemas[collectionPath] || null;
  }

  private modelSchema: Schema | null;

  async createDocument(data: T) {
    try {
      let docData: Record<string, unknown> = {
        ...data,
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: auth.currentUser?.email || "",
        createdById: auth.currentUser?.uid || "",
      };
      if (this.modelSchema) {
        docData = typeCastObject<T>(this.modelSchema)(docData);
      }
      const docRef = await addDoc(
        collection(db, this.collectionPath),
        docData as FirestoreUpdateData
      );
      return docRef.id;
    } catch (error: unknown) {
      const errorMessage =
        (error as FirebaseError).message || "Error creating document";
      throw new Error(errorMessage);
    }
  }

  async updateDocument(id: string, data: Partial<T>) {
    try {
      let docData: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.fromDate(new Date()),
        updatedBy: auth.currentUser?.email || "",
      };
      if (this.modelSchema) {
        docData = typeCastObject<T>(this.modelSchema)(docData);
      }
      await updateDoc(
        doc(db, this.collectionPath, id),
        docData as FirestoreUpdateData
      );
      return id;
    } catch (error: unknown) {
      const errorMessage =
        (error as FirebaseError).message || "Error updating document";
      throw new Error(errorMessage);
    }
  }

  async deleteDocument(id: string) {
    try {
      await deleteDoc(doc(db, this.collectionPath, id));
    } catch (error: unknown) {
      const errorMessage =
        (error as FirebaseError).message || "Error deleting document";
      throw new Error(errorMessage);
    }
  }

  async getDocuments(
    pageSize = 10,
    lastDoc?: DocumentSnapshot,
    conditions: { prop: string; op: WhereFilterOp; val: unknown }[] = []
  ) {
    try {
      let q = query(
        collection(db, this.collectionPath),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );
      conditions.forEach((condition) => {
        q = query(q, where(condition.prop, condition.op, condition.val));
      });
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...typeCastObject<T>(this.modelSchema || {})(
          doc.data() as Record<string, unknown>
        ),
        ref: doc,
      }));
      const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
      return { docs, lastDoc: newLastDoc, isLastPage: docs.length < pageSize };
    } catch (error: unknown) {
      const errorMessage =
        (error as FirebaseError).message || "Error fetching documents";
      throw new Error(errorMessage);
    }
  }

  listenDocuments(
    callback: (docs: (T & { id: string; ref: DocumentSnapshot })[]) => void,
    pageSize = 10,
    conditions: { prop: string; op: WhereFilterOp; val: unknown }[] = []
  ) {
    let q = query(
      collection(db, this.collectionPath),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
    conditions.forEach((condition) => {
      q = query(q, where(condition.prop, condition.op, condition.val));
    });
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...typeCastObject<T>(this.modelSchema || {})(
            doc.data() as Record<string, unknown>
          ),
          ref: doc,
        }));
        callback(docs);
      },
      (error) => {
        console.error(
          "Error listening to documents:",
          (error as FirebaseError).message
        );
      }
    );
    return unsubscribe;
  }

  async getNextPage(
    pageSize: number,
    lastDoc?: DocumentSnapshot,
    conditions: { prop: string; op: WhereFilterOp; val: unknown }[] = []
  ) {
    return this.getDocuments(pageSize, lastDoc, conditions);
  }

  async getPrevPage(
    pageSize: number,
    lastDoc?: DocumentSnapshot,
    conditions: { prop: string; op: WhereFilterOp; val: unknown }[] = []
  ) {
    try {
      let q = query(
        collection(db, this.collectionPath),
        orderBy("createdAt", "desc"),
        limitToLast(pageSize)
      );
      conditions.forEach((condition) => {
        q = query(q, where(condition.prop, condition.op, condition.val));
      });
      if (lastDoc) {
        q = query(q, endAt(lastDoc));
      }
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...typeCastObject<T>(this.modelSchema || {})(
          doc.data() as Record<string, unknown>
        ),
        ref: doc,
      }));
      const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
      return { docs, lastDoc: newLastDoc, isLastPage: docs.length < pageSize };
    } catch (error: unknown) {
      const errorMessage =
        (error as FirebaseError).message || "Error fetching previous page";
      throw new Error(errorMessage);
    }
  }
}

export class StorageActions {
  static async uploadFile(fullPath: string, file: File) {
    try {
      const metadata = { contentType: file.type };
      const snapshot = await uploadBytes(
        ref(storage, fullPath),
        file,
        metadata
      );
      const url = await getDownloadURL(snapshot.ref);
      return { fullPath: snapshot.ref.fullPath, url };
    } catch (error: unknown) {
      const errorMessage =
        (error as FirebaseError).message || "Error uploading file";
      throw new Error(errorMessage);
    }
  }

  static async removeFile(fullPath: string) {
    try {
      await deleteObject(ref(storage, fullPath));
      return `File at ${fullPath} deleted successfully.`;
    } catch (error: unknown) {
      if ((error as FirebaseError).code === "storage/object-not-found") {
        return `File at ${fullPath} does not exist.`;
      }
      const errorMessage =
        (error as FirebaseError).message || "Error deleting file";
      throw new Error(errorMessage);
    }
  }
}
