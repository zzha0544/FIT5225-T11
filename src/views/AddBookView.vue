<template>
    <div class="container mt-5">
        <h1 class="text-center">Firestore Demo</h1>

        <!-- 添加书籍表单 -->
        <div class="mb-8">
            <h2 class="text-center mb-3">Add Book</h2>
            <form @submit.prevent="addBook" class="text-center">
                <div class="mb-3">
                    <label for="isbn">ISBN:</label>
                    <input type="text" v-model="isbn" id="isbn" required />
                </div>
                <div class="mb-3">
                    <label for="name">Name:</label>
                    <input type="text" v-model="name" id="name" required />
                </div>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Add Book</button>
            </form>
        </div>

        <!-- 书籍列表（更新/删除） -->
        <div class="mb-8">
            <h2 class="text-center mb-3">All Books</h2>
            <ul class="text-center">
                <li v-for="book in books" :key="book.id" class="inline-block w-full mb-2 ">
                    <div class="flex items-center justify-between">
                        <span>{{ book.data.isbn }} - {{ book.data.name }}</span>
                        <div>
                            <button @click="updateBook(book.id)"
                                class="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Update</button>
                            <button @click="deleteBook(book.id)"
                                class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 查询功能 -->
        <div class="text-center">
            <h2 class=" text-center mb-3">Query Books</h2>
            <div class="text-center mb-3">
                <button @click="fetchBooksByQuery" class="bg-green-500 text-white px-4 py-2 rounded">
                    Fetch Books with Query isbn > 1000, Order by ISBN Ascending, Limit 5
                </button>
            </div>
            <ul class="text-center">
                <li v-for="book in filteredBooks" :key="book.id" class="mb-2">
                    {{ book.data.isbn }} - {{ book.data.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from "@/firebase/init";
import {
    collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
    query, where, orderBy, limit
} from 'firebase/firestore';

export default {
    setup() {
        const isbn = ref('');
        const name = ref('');
        const books = ref([]);
        const filteredBooks = ref([]);

        // 添加书籍
        const addBook = async () => {
            try {
                const isbnNumber = Number(isbn.value);
                if (isNaN(isbnNumber)) {
                    alert('ISBN必须是有效的数字');
                    return;
                }

                await addDoc(collection(db, 'books'), {
                    isbn: isbnNumber,
                    name: name.value
                });

                isbn.value = '';
                name.value = '';
                alert('书籍添加成功!');
                fetchAllBooks();
            } catch (error) {
                console.error('添加书籍错误: ', error);
                alert('添加书籍失败: ' + error.message);
            }
        };

        // 获取所有书籍
        const fetchAllBooks = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'books'));
                const bookList = [];
                querySnapshot.forEach((doc) => {
                    bookList.push({ id: doc.id, data: doc.data() });
                });
                books.value = bookList;
            } catch (error) {
                console.error('获取书籍列表错误: ', error);
            }
        };

        // 更新书籍
        const updateBook = async (bookId) => {
            const newName = prompt('请输入新的书籍名称');
            if (!newName) return;

            try {
                const bookRef = doc(db, 'books', bookId);
                await updateDoc(bookRef, {
                    name: newName
                });

                alert('书籍更新成功!');
                fetchAllBooks();
            } catch (error) {
                console.error('更新书籍错误: ', error);
                alert('更新书籍失败: ' + error.message);
            }
        };

        // 删除书籍
        const deleteBook = async (bookId) => {
            const confirmDelete = confirm('确定要删除这本书吗?');
            if (!confirmDelete) return;

            try {
                const bookRef = doc(db, 'books', bookId);
                await deleteDoc(bookRef);

                alert('书籍删除成功!');
                fetchAllBooks();
            } catch (error) {
                console.error('删除书籍错误: ', error);
                alert('删除书籍失败: ' + error.message);
            }
        };

        // 查询书籍
        const fetchBooksByQuery = async () => {
            try {
                const q = query(
                    collection(db, 'books'),
                    where('isbn', '>', 1000),  // where条件：ISBN大于1000
                    orderBy('isbn', 'asc'),   // 按ISBN升序排列
                    limit(5)                  // 最多返回5条记录
                );

                const querySnapshot = await getDocs(q);
                const bookList = [];
                querySnapshot.forEach((doc) => {
                    bookList.push({ id: doc.id, data: doc.data() });
                });
                filteredBooks.value = bookList;

                alert('查询成功!');
            } catch (error) {
                console.error('查询书籍错误: ', error);
                alert('查询书籍失败: ' + error.message);
            }
        };

        // 组件挂载时获取所有书籍
        onMounted(() => {
            fetchAllBooks();
        });

        return {
            isbn,
            name,
            books,
            filteredBooks,
            addBook,
            updateBook,
            deleteBook,
            fetchBooksByQuery
        };
    }
};
</script>