class LossesController < ApplicationController

    def index
        losses = Loss.all 
        render json: losses
    end

    def show
        loss = Loss.find(params[:id])
        render json: loss
    end

    def new
        loss = Loss.new
    end

    def create
        loss = Loss.create(loss_params)
        render json: loss
    end

    def destroy
        loss = Loss.find(params[:id])
        loss.destroy
    end

    
    private

    def loss_params
        params.require(:loss).permit(:user_id)
    end

end
