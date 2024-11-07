<template>
  <div class="bg-image"></div>
  <div class="container">
    <div id="phone">
      <!-- 카드 컨테이너에 3D 전환을 위한 클래스 추가 -->
      <div class="card-container" :class="{ flipped: !isLoginVisible }">
        <!-- 로그인 카드 -->
        <div class="card front" id="login">
          <h1>Sign in</h1>
          <div class="input">
            <input id="email" type="email" v-model="email" placeholder=" " />
            <label for="email">Username or Email</label>
          </div>
          <div class="input">
            <input id="password" type="password" v-model="password" placeholder=" " />
            <label for="password">Password</label>
          </div>
          <div class="checkbox">
            <input type="checkbox" id="remember" v-model="rememberMe" />
            <label for="remember">Remember me</label>
          </div>
          <a href="#" class="forgot">Forgot Password?</a>
          <button @click="handleLogin" :disabled="!isLoginFormValid">Login</button>
          <div class="account-check">
            Don't have an account? <a href="#" @click.prevent="toggleCard">Sign up</a>
          </div>
        </div>

        <!-- 회원가입 카드 -->
        <div class="card back" id="register">
          <h1>Sign up</h1>
          <div class="input">
            <input id="register-email" type="email" v-model="registerEmail" placeholder=" " />
            <label for="register-email">Email</label>
          </div>
          <div class="input">
            <input id="register-password" type="password" v-model="registerPassword" placeholder=" " />
            <label for="register-password">Password</label>
          </div>
          <div class="input">
            <input id="confirm-password" type="password" v-model="confirmPassword" placeholder=" " />
            <label for="confirm-password">Confirm Password</label>
          </div>
          <div class="checkbox">
            <input type="checkbox" id="terms" v-model="acceptTerms" />
            <label for="terms">I have read <b>Terms and Conditions</b></label>
          </div>
          <button @click="handleRegister" :disabled="!isRegisterFormValid">Register</button>
          <div class="account-check">
            Already have an account? <a href="#" @click.prevent="toggleCard">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoginVisible = ref(true)
const email = ref('')
const password = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const confirmPassword = ref('')
const rememberMe = ref(false)
const acceptTerms = ref(false)

const isLoginFormValid = computed(() => !!email.value && !!password.value)
const isRegisterFormValid = computed(() => !!registerEmail.value && !!registerPassword.value && !!confirmPassword.value && registerPassword.value === confirmPassword.value && acceptTerms.value)

const toggleCard = () => {
  isLoginVisible.value = !isLoginVisible.value
}

const handleLogin = async () => {
  try {
    alert('Login successful')
    router.push('/') // 로그인 후 홈으로 이동
  } catch (error) {
    alert('Login failed')
  }
}

const handleRegister = async () => {
  try {
    alert('Registration successful')
    toggleCard()
  } catch (error) {
    alert('Registration failed')
  }
}
</script>

<style scoped>
:root {
  --container-start-color: #ECECEC;
  --container-end-color: #100f0f;
}

.bg-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
}

.bg-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(27, 27, 27, 0.90);
}

.container {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

#phone {
  width: 400px;
  max-width: 90vw;
  perspective: 1000px;
  text-align: center;
}

.card-container {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-container.flipped {
  transform: rotateY(180deg);
}

.card {
  width: 100%;
  padding: 30px 40px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.front {
  z-index: 2;
}

.back {
  transform: rotateY(180deg);
}

h1 {
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  margin-top: 0;
  color: #272727;
}

button {
  display: block;
  border-radius: 50px;
  border: none;
  width: 100%;
  background-color: #2069ff;
  color: #fff;
  padding: 15px;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0px 10px 30px rgba(23, 83, 209, 0.3);
  transition: all 0.2s ease;
  cursor: pointer;
}

button:hover {
  box-shadow: 0px 2px 10px rgba(23, 83, 209, 0.4);
}

.account-check {
  margin-top: 20px;
  font-size: 0.85rem;
  color: #666;
}

.account-check a {
  color: #2069ff;
  font-weight: 600;
  text-decoration: none;
}

.input {
  position: relative;
  margin-top: 20px;
}

.input input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #9e9e9e;
  width: 100%;
  font-size: 1rem;
  padding: 10px 0;
  outline: none;
}

.input label {
  color: #9e9e9e;
  font-size: 0.9rem;
  position: absolute;
  top: 12px;
  left: 0;
  transition: all 0.3s ease;
}

.input input:focus + label,
.input input:not(:placeholder-shown) + label {
  top: -10px;
  font-size: 0.75rem;
  color: #2069ff;
}

.checkbox {
  margin-top: 15px;
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
}

.checkbox input {
  margin-right: 10px;
}
</style>
