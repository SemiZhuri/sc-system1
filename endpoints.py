from fastapi import APIRouter, HTTPException, Depends
import models
from database import SessionLocal
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

load_dotenv()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

secret_key = os.getenv("SECRET_KEY")




# Use APIRouter instead of FastAPI
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    name: str
    email: str
    role: models.roleEnum
    password: str

@router.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    print(f"Password: {user.password}, Type: {type(user.password)}")
    new_user = models.User(name=user.name, email=user.email, role=user.role,password=pwd_context.hash(user.password)) 
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/users/")
def read_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

class CourseCreate(BaseModel):
    title: str
    description: str

@router.post("/courses/")
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    new_course = models.Course(title=course.title, description=course.description)
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.get("/courses/")
def read_courses(db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    return courses

@router.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.delete(course)
    db.commit()
    return {"message": "Course deleted successfully"}


class RegistrationCreate(BaseModel):
    user_id: int
    course_id: int

@router.post("/registrations/")
def create_registration(reg: RegistrationCreate, db: Session = Depends(get_db)):
    exists = db.query(models.Registration).filter(
        models.Registration.user_id == reg.user_id,
        models.Registration.course_id == reg.course_id
    ).first()
    if exists:
        raise HTTPException(status_code=400, detail="User already registered for this course")
    
    new_reg = models.Registration(user_id=reg.user_id, course_id=reg.course_id)
    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)
    return new_reg

@router.get("/registrations/")
def read_registrations(db: Session = Depends(get_db)):
    return db.query(models.Registration).all()

@router.delete("/registrations/{registration_id}")
def delete_registration(registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(models.Registration).filter(models.Registration.id == registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    db.delete(reg)
    db.commit()
    return {"message": "Registration deleted successfully"}

@router.post("/login/")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Generate JWT token
    token_data = {"sub": user.email}
    token = jwt.encode(token_data, secret_key, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.get("/me/")
def read_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.post("/logout/")
def logout(token: str = Depends(oauth2_scheme)):
    return {"message": "Logout successful"}

