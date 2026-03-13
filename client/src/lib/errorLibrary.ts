export interface ErrorEntry {
  id: string;
  title: string;
  language: string;
  category: string;
  description: string;
  brokenCode: string;
  fixedCode: string;
  explanation: string;
  prevention: string;
}

export const ERROR_LIBRARY: ErrorEntry[] = [
  {
    id: "py-name-error",
    title: "NameError: Variable Not Defined",
    language: "Python",
    category: "Runtime Error",
    description: "Occurs when you try to use a variable that hasn't been defined yet.",
    brokenCode: `# ❌ Broken Code
def calculate_total():
    result = price * quantity  # 'price' is not defined
    return result

print(calculate_total())`,
    fixedCode: `# ✅ Fixed Code
def calculate_total():
    price = 29.99      # Define variables first
    quantity = 3
    result = price * quantity
    return result

print(calculate_total())  # Output: 89.97`,
    explanation: "Python raises a NameError when it encounters a name that isn't defined in the current scope. Always declare and assign variables before using them.",
    prevention: "Always initialize variables before use. Use an IDE with linting to catch undefined variables early.",
  },
  {
    id: "py-index-error",
    title: "IndexError: List Index Out of Range",
    language: "Python",
    category: "Runtime Error",
    description: "Occurs when you try to access a list element using an index that doesn't exist.",
    brokenCode: `# ❌ Broken Code
fruits = ["apple", "banana", "cherry"]
print(fruits[5])  # IndexError: list index out of range`,
    fixedCode: `# ✅ Fixed Code
fruits = ["apple", "banana", "cherry"]

# Check length before accessing
if len(fruits) > 5:
    print(fruits[5])
else:
    print(f"List only has {len(fruits)} items")
    print(fruits[-1])  # Last item: "cherry"`,
    explanation: "Python lists are zero-indexed. A list with 3 items has indices 0, 1, and 2. Accessing index 5 on a 3-item list causes an IndexError.",
    prevention: "Always check list length before accessing by index, or use try/except to handle the error gracefully.",
  },
  {
    id: "py-type-error",
    title: "TypeError: Unsupported Operand Types",
    language: "Python",
    category: "Runtime Error",
    description: "Occurs when an operation is applied to objects of incompatible types.",
    brokenCode: `# ❌ Broken Code
age = input("Enter your age: ")  # Returns string
next_year_age = age + 1  # TypeError: can't add str and int`,
    fixedCode: `# ✅ Fixed Code
age = input("Enter your age: ")
age = int(age)  # Convert string to integer
next_year_age = age + 1
print(f"Next year you'll be {next_year_age}")`,
    explanation: "The input() function always returns a string. You can't add a string and an integer directly. Convert the string to the appropriate type first.",
    prevention: "Always convert input data to the correct type. Use int(), float(), or str() for type conversion.",
  },
  {
    id: "js-undefined",
    title: "TypeError: Cannot Read Property of Undefined",
    language: "JavaScript",
    category: "Runtime Error",
    description: "Occurs when you try to access a property of an undefined variable.",
    brokenCode: `// ❌ Broken Code
const user = null;
console.log(user.name);  // TypeError: Cannot read properties of null`,
    fixedCode: `// ✅ Fixed Code
const user = null;

// Option 1: Optional chaining (?.)
console.log(user?.name);  // undefined (no error)

// Option 2: Null check
if (user) {
  console.log(user.name);
} else {
  console.log("User not found");
}`,
    explanation: "Accessing properties on null or undefined throws a TypeError. Use optional chaining (?.) or null checks to safely access nested properties.",
    prevention: "Use optional chaining (?.) for nested property access, and always validate data before accessing its properties.",
  },
  {
    id: "js-syntax-error",
    title: "SyntaxError: Unexpected Token",
    language: "JavaScript",
    category: "Syntax Error",
    description: "Occurs when the JavaScript parser encounters code it doesn't understand.",
    brokenCode: `// ❌ Broken Code
function greet(name) {
  if (name === "Alice") {
    console.log("Hello Alice!")
  // Missing closing brace
  
console.log(greet("Alice"));`,
    fixedCode: `// ✅ Fixed Code
function greet(name) {
  if (name === "Alice") {
    console.log("Hello Alice!");
  } else {
    console.log(\`Hello \${name}!\`);
  }
}  // Don't forget closing braces!

console.log(greet("Alice"));`,
    explanation: "JavaScript requires matching braces, brackets, and parentheses. A missing closing brace causes a SyntaxError because the parser can't determine where the function ends.",
    prevention: "Use a code editor with bracket matching. Always close every opening brace, bracket, and parenthesis.",
  },
  {
    id: "js-async-error",
    title: "Unhandled Promise Rejection",
    language: "JavaScript",
    category: "Async Error",
    description: "Occurs when a Promise is rejected without a catch handler.",
    brokenCode: `// ❌ Broken Code
async function fetchData() {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();
  return data;
}

fetchData();  // No error handling!`,
    fixedCode: `// ✅ Fixed Code
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch:", error.message);
    return null;
  }
}

fetchData();`,
    explanation: "Async operations can fail for many reasons (network issues, server errors). Always wrap async code in try/catch to handle errors gracefully.",
    prevention: "Always use try/catch with async/await, or .catch() with Promises. Never leave async operations without error handling.",
  },
  {
    id: "java-npe",
    title: "NullPointerException",
    language: "Java",
    category: "Runtime Error",
    description: "The most common Java error — occurs when you try to use a null reference.",
    brokenCode: `// ❌ Broken Code
public class Main {
    public static void main(String[] args) {
        String name = null;
        System.out.println(name.length()); // NullPointerException!
    }
}`,
    fixedCode: `// ✅ Fixed Code
public class Main {
    public static void main(String[] args) {
        String name = null;
        
        // Check for null before using
        if (name != null) {
            System.out.println(name.length());
        } else {
            System.out.println("Name is null");
        }
        
        // Or use Optional (Java 8+)
        Optional.ofNullable(name)
            .ifPresent(n -> System.out.println(n.length()));
    }
}`,
    explanation: "In Java, null means 'no object'. Calling methods on null throws NullPointerException. Always check for null before using object references.",
    prevention: "Use null checks, Optional<T>, or @NonNull annotations. Initialize variables with default values when possible.",
  },
  {
    id: "java-array-oob",
    title: "ArrayIndexOutOfBoundsException",
    language: "Java",
    category: "Runtime Error",
    description: "Occurs when accessing an array element with an invalid index.",
    brokenCode: `// ❌ Broken Code
public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30};
        System.out.println(numbers[3]); // Index 3 doesn't exist!
    }
}`,
    fixedCode: `// ✅ Fixed Code
public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30};
        
        // Check bounds before accessing
        int index = 3;
        if (index < numbers.length) {
            System.out.println(numbers[index]);
        } else {
            System.out.println("Index out of bounds. Array length: " + numbers.length);
        }
    }
}`,
    explanation: "Java arrays are zero-indexed. An array of size 3 has valid indices 0, 1, 2. Accessing index 3 throws ArrayIndexOutOfBoundsException.",
    prevention: "Always validate indices against array.length before accessing. Use enhanced for-loops when you don't need the index.",
  },
  {
    id: "cpp-segfault",
    title: "Segmentation Fault (Null Pointer)",
    language: "C++",
    category: "Runtime Error",
    description: "Occurs when the program tries to access memory it doesn't have permission to access.",
    brokenCode: `// ❌ Broken Code
#include <iostream>
using namespace std;

int main() {
    int* ptr = nullptr;
    *ptr = 42;  // Segmentation fault!
    cout << *ptr << endl;
    return 0;
}`,
    fixedCode: `// ✅ Fixed Code
#include <iostream>
using namespace std;

int main() {
    // Option 1: Allocate memory first
    int* ptr = new int;
    *ptr = 42;
    cout << *ptr << endl;
    delete ptr;  // Free memory!
    
    // Option 2: Use a regular variable
    int value = 42;
    int* ptr2 = &value;
    cout << *ptr2 << endl;
    
    return 0;
}`,
    explanation: "Dereferencing a null pointer causes a segmentation fault because the program tries to read/write to memory address 0, which is protected by the OS.",
    prevention: "Always initialize pointers. Check for nullptr before dereferencing. Prefer smart pointers (unique_ptr, shared_ptr) in modern C++.",
  },
  {
    id: "py-indent-error",
    title: "IndentationError: Unexpected Indent",
    language: "Python",
    category: "Syntax Error",
    description: "Python uses indentation to define code blocks. Inconsistent indentation causes errors.",
    brokenCode: `# ❌ Broken Code
def greet(name):
    print(f"Hello, {name}!")
      print("How are you?")  # Extra spaces!
    return True`,
    fixedCode: `# ✅ Fixed Code
def greet(name):
    print(f"Hello, {name}!")
    print("How are you?")  # Consistent 4-space indent
    return True

greet("Alice")`,
    explanation: "Python uses indentation (spaces or tabs) to define code blocks. All lines in the same block must have the same indentation level. Mixing spaces and tabs, or using inconsistent spacing, causes IndentationError.",
    prevention: "Use a consistent indentation style (4 spaces recommended). Configure your editor to show whitespace characters and use auto-formatting.",
  },
];

export const LANGUAGES = [
  { value: "python", label: "Python", monacoId: "python" },
  { value: "javascript", label: "JavaScript", monacoId: "javascript" },
  { value: "typescript", label: "TypeScript", monacoId: "typescript" },
  { value: "java", label: "Java", monacoId: "java" },
  { value: "cpp", label: "C++", monacoId: "cpp" },
  { value: "c", label: "C", monacoId: "c" },
  { value: "csharp", label: "C#", monacoId: "csharp" },
  { value: "go", label: "Go", monacoId: "go" },
  { value: "rust", label: "Rust", monacoId: "rust" },
  { value: "php", label: "PHP", monacoId: "php" },
  { value: "ruby", label: "Ruby", monacoId: "ruby" },
  { value: "swift", label: "Swift", monacoId: "swift" },
  { value: "kotlin", label: "Kotlin", monacoId: "kotlin" },
  { value: "html", label: "HTML", monacoId: "html" },
  { value: "css", label: "CSS", monacoId: "css" },
  { value: "sql", label: "SQL", monacoId: "sql" },
  { value: "bash", label: "Bash/Shell", monacoId: "shell" },
];

export const EXAMPLE_SNIPPETS: Record<string, { code: string; description: string }> = {
  python: {
    description: "Python function with a common bug",
    code: `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)  # Bug: ZeroDivisionError if list is empty!
    return average

# Test it
scores = [85, 92, 78, 95, 88]
print(f"Average: {calculate_average(scores)}")

# This will crash:
empty_list = []
print(calculate_average(empty_list))  # ZeroDivisionError!`,
  },
  javascript: {
    description: "JavaScript async function with error handling issue",
    code: `async function getUserData(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = response.json();  // Bug: missing await!
  return data.name;  // Bug: data is a Promise, not an object
}

// Also missing error handling
getUserData(123).then(name => {
  console.log("User:", name);
});`,
  },
  java: {
    description: "Java code with NullPointerException risk",
    code: `import java.util.ArrayList;
import java.util.List;

public class StudentGrades {
    public static double getAverage(List<Integer> grades) {
        int sum = 0;
        for (int grade : grades) {
            sum += grade;
        }
        return sum / grades.size();  // Bug: integer division!
    }
    
    public static void main(String[] args) {
        List<Integer> grades = new ArrayList<>();
        grades.add(85);
        grades.add(92);
        grades.add(78);
        
        System.out.println("Average: " + getAverage(grades));
        System.out.println("Average: " + getAverage(null));  // NullPointerException!
    }
}`,
  },
  cpp: {
    description: "C++ code with memory management issue",
    code: `#include <iostream>
#include <string>
using namespace std;

int* createArray(int size) {
    int arr[size];  // Bug: VLA on stack, returned pointer will be invalid!
    for (int i = 0; i < size; i++) {
        arr[i] = i * 2;
    }
    return arr;  // Returning pointer to local variable!
}

int main() {
    int* myArray = createArray(5);
    for (int i = 0; i < 5; i++) {
        cout << myArray[i] << " ";  // Undefined behavior!
    }
    return 0;
}`,
  },
};
