class UsersController < ApplicationController

    def index
        users = User.all
        render json: users 
    end

    def show
        user = User.find(params[:id])
        render json: user
    end

    def new
        user = User.new
    end

    def create
        user = User.create(user_params)
        render json: user
    end

    def destroy
        user = User.find(params[:id])
        user.destroy
    end

    def edit
        user = User.find(params[:id])
    end

    def update
        user = User.find(params[:id])
        user.update(user_params)
        render json: user
    end

    private

    def find_user
        user = User.find(params[:id])
        render json: user
    end

    def user_params
        params.require(:user).permit(:username, :password)
    end

end
