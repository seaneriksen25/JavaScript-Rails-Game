class WinsController < ApplicationController

    def index
        wins = Win.all 
        render json: wins
    end

    def show
        win = Win.find(params[:id])
        render json: win 
    end

    def new
        win = Win.new
    end

    def create
        win = Win.create(win_params)
        render json: win
    end

    def destroy
        win = Win.find(params[:id])
        win.destroy
    end

    
    private

    def win_params
        params.require(:win).permit(:user_id)
    end

end
